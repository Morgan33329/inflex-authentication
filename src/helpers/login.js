import bcrypt from 'bcrypt';
import Promise from 'bluebird';
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
const notActivated = "This user is not activated";

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
                log('Account found ' + JSON.stringify(account));

                let getPassword = function () {
                    return new Promise((resolve, reject) => {
                        database()
                            .repository('password')
                            .findAllByIdentity(account.identity_id)
                            .then((existsPasswords) => {
                                var checkPassword = function(key, pass) {
                                    if (!pass[key])
                                        return resolve(null);

                                    bcrypt.compare(password, pass[key].password, function(err, res) {
                                        if (res) {
                                            log('Valid password found');

                                            resolve(pass[key]);
                                        } else {
                                            log('Invalid password');

                                            checkPassword(key + 1, existsPasswords);
                                        }
                                    });
                                }

                                checkPassword(0, existsPasswords);
                            })
                            .catch((err) => {
                                reject(err);
                            });
                    })
                }

                let getIdentity = function () {
                    return new Promise((resolve, reject) => {
                        database()
                            .repository('identity')
                            .findOneById(account.identity_id)
                            .then(identity => {
                                if (!identity)
                                    reject('Identity not found');
                                else
                                    resolve(identity)
                            })
                            .catch((err) => {
                                reject(err);
                            });
                    });
                }

                Promise
                    .all([
                        getPassword(),
                        getIdentity()
                    ])
                    .then(values => {
                        let password = values[0],
                            identity = values[1];

                        if (!password)
                            return done(null, false, { message: msg, code : 1 });
                        else if (!identity.activated) { console.log(notActivated);
                            return done(null, false, { message: notActivated, code : 2 });
                        } else 
                            createObject({
                                identity : database().getId(identity),
                                password : database().getId(password),
                                account : database().getId(account)
                            })
                            .then(user => {
                                done(null, user);
                            })
                            .catch((err) => {
                                console.error(err);

                                return done(null, false, { message: 'Something bad', code : -1 });
                            });
                    })
                    .catch(err => {
                        console.error(err);

                        done(null, false, { message: 'Something bad', code : -1 });
                    });
            } else {
                log("Account " + username + " not found");

                done(null, false, { message: msg, code : 3 });
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

            account.id = database().getId(account.user);

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