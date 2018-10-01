import bcrypt from 'bcrypt';

import database from './../database';
import logout from './../services/logout';
import tokenGenerators from './../helpers/token';
import {
    createObject
} from "./user";

const msg = "Invalid username or password";

export default class {
    byUsernameAndPassword (username, password, done) {
        var self = this;

        database()
            .repository('account')
            .findByAccount(username)
            .then((account) => {
                if (account) {
                    console.log('Account found' + account.identity_id);

                    database()
                        .repository('password')
                        .findAllByIdentity(account.identity_id)
                        .then((existsPasswords) => {
                            var checkPassword = function(key, pass) {
                                if (!pass[key])
                                    return done(null, false, { message: msg });

                                bcrypt.compare(password, pass[key].password, function(err, res) {
                                    if (res) {
                                        console.log('Valid password found');

                                        createObject({
                                            identity : account.identity_id,
                                            password : database().getId(pass[key]),
                                            account : database().getId(account)
                                        })
                                        .then(user => {
                                            done(null, user);
                                        })
                                        .catch((err) => {
                                            throw err;
                                        });
                                    } else {
                                        console.log('Invalid password');

                                        checkPassword(key + 1, existsPasswords);
                                    }
                                });
                            }

                            checkPassword(0, existsPasswords);
                        })
                        .catch((err) => {
                            throw err;
                        });
                } else {
                    console.log("Account " + username + " not found");

                    done(null, false, { message: msg });
                }
            })
            .catch((err) => {
                throw err;
            });
    }

    successLoginInMiddleware (account, req, next, settings) {
        req.logIn(account, {
            "session" : settings && settings.session ? settings.session : false
        }, function(err) {
            if (err) { return next(err); }
            //Duplikálva a defender/jwt.jsbe
            req.token = function(type) {
                type = type || "jwt";

                var generator = tokenGenerators(type);

                if (generator) {
                    generator.user(account);

                    return generator;
                } else {
                    process.exit(1);
                }
            };

            req.logout = function() {
                var lo = new logout();

                lo.user(account);

                lo.logout();
            }

            next();
        });
    }
}