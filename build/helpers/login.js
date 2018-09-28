'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.appendInputValidation = appendInputValidation;
exports.byUsernameAndPassword = byUsernameAndPassword;
exports.successLoginInMiddleware = successLoginInMiddleware;

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _check = require('express-validator/check');

var _authentication = require('./../authentication');

var _database = require('./../database');

var _database2 = _interopRequireDefault(_database);

var _logout = require('./../services/logout');

var _logout2 = _interopRequireDefault(_logout);

var _device = require('./../services/device/device');

var _device2 = _interopRequireDefault(_device);

var _token = require('./../helpers/token');

var _token2 = _interopRequireDefault(_token);

var _user = require('./user');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var msg = "Invalid username or password";

var validateToArray = function validateToArray(ret, data) {
    if (!data) return ret;

    if (Array.isArray(data)) {
        for (var i in data) {
            ret.push(data[i]);
        }
    } else ret.push(data);

    return ret;
};

function appendInputValidation(middleware, settings) {
    var inputs = (0, _authentication.authConfig)('validateInputs');

    middleware = validateToArray(middleware, function (req, res, next) {
        if (!req.body.username) settings.invalidRequest(req, res, ['username'], settings);else next();
    });

    middleware = validateToArray(middleware, inputs.password((0, _check.check)(settings.passwordField)));

    middleware.push(function (req, res, next) {
        var errors = (0, _check.validationResult)(req);

        if (!errors.isEmpty()) {
            console.log('Invalid authenticate request', errors.array());

            settings.invalidRequest(req, res, errors.array(), settings);
        } else next();
    });

    return middleware;
}

function byUsernameAndPassword(username, password, done) {
    (0, _database2.default)().repository('account').findByAccount(username).then(function (account) {
        if (account) {
            console.log('Account found' + account.identity_id);

            (0, _database2.default)().repository('password').findAllByIdentity(account.identity_id).then(function (existsPasswords) {
                var checkPassword = function checkPassword(key, pass) {
                    if (!pass[key]) return done(null, false, { message: msg });

                    _bcrypt2.default.compare(password, pass[key].password, function (err, res) {
                        if (res) {
                            console.log('Valid password found');

                            (0, _user.createObject)({
                                identity: account.identity_id,
                                password: (0, _database2.default)().getId(pass[key]),
                                account: (0, _database2.default)().getId(account)
                            }).then(function (user) {
                                done(null, user);
                            }).catch(function (err) {
                                throw err;
                            });
                        } else {
                            console.log('Invalid password');

                            checkPassword(key + 1, existsPasswords);
                        }
                    });
                };

                checkPassword(0, existsPasswords);
            }).catch(function (err) {
                throw err;
            });
        } else {
            console.log("Account " + username + " not found");

            done(null, false, { message: msg });
        }
    }).catch(function (err) {
        throw err;
    });
}

function successLoginInMiddleware(account, req, next, settings) {
    var deviceService = new _device2.default();

    deviceService.user(account).create(req.body.device || {}).then(function (device) {
        account.device = device;

        req.logIn(account, {
            "session": settings && settings.session ? settings.session : false
        }, function (err) {
            if (err) {
                return next(err);
            }
            //Duplikálva a defender/jwt.jsbe
            req.token = function (type) {
                type = type || "jwt";

                var generator = (0, _token2.default)(type);

                if (generator) {
                    generator.user(account);

                    return generator;
                } else {
                    process.exit(1);
                }
            };

            req.logout = function () {
                var lo = new _logout2.default();

                lo.user(account);

                lo.logout();
            };

            next();
        });
    });
}