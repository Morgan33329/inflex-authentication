import bcrypt from 'bcrypt';
import { check, validationResult } from 'express-validator/check';

import { authConfig } from './../authentication';
import database from './../database';
import logout from './../services/logout';
import device from './../services/device/device';
import tokenGenerators from './../helpers/token';
import {
    createObject
} from "./user";

function log (data) {
    let l = authConfig('log')

    l(data);
};

const msg = "Invalid username or password";

var validateToArray = function(ret, data) {
    if (!data)
        return ret;

    if (Array.isArray(data)) {
        for (let i in data)
            ret.push(data[i]);
    } else
        ret.push(data);

    return ret;
}

export function appendInputValidation (middleware, settings) {
    let inputs = authConfig('validateInputs');

    middleware = validateToArray(middleware, (req, res, next) => {
        if (!req.body[settings.usernameField])
            settings.invalidRequest(req, res, [settings.usernameField], settings);
        else
            next();
    });

    middleware = validateToArray(middleware, inputs.password(check(settings.passwordField)));

    middleware.push(
        function(req, res, next) {
            let errors = validationResult(req);

            if (!errors.isEmpty()) {
                log('Invalid authenticate request', errors.array());
        
                settings.invalidRequest(req, res, errors.array(), settings);
            } else
                next();
        }
    );

    return middleware;
}

export function byUsernameAndPassword (username, password, done) {
    database()
        .repository('account')
        .findByAccount(username)
        .then((account) => {
            if (account) {
                log('Account found' + account.identity_id);

                database()
                    .repository('password')
                    .findAllByIdentity(account.identity_id)
                    .then((existsPasswords) => {
                        var checkPassword = function(key, pass) {
                            if (!pass[key])
                                return done(null, false, { message: msg });

                            bcrypt.compare(password, pass[key].password, function(err, res) {
                                if (res) {
                                    log('Valid password found');

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
                                    log('Invalid password');

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
                log("Account " + username + " not found");

                done(null, false, { message: msg });
            }
        })
        .catch((err) => {
            throw err;
        });
}

export function successLoginInMiddleware (account, req, next, settings) {
    let deviceService = new device();

    deviceService
        .user(account)
        .create(req.body.device || {})
        .then(device => {
            account.device = device;

            req.logIn(account, {
                "session" : settings && settings.session ? settings.session : false
            }, (err) => {
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
        });
}