'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _database = require('./../database');

var _database2 = _interopRequireDefault(_database);

var _logout = require('./../services/logout');

var _logout2 = _interopRequireDefault(_logout);

var _token = require('./../helpers/token');

var _token2 = _interopRequireDefault(_token);

var _user = require('./user');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var msg = "Invalid username or password";

var _class = function () {
    function _class() {
        _classCallCheck(this, _class);
    }

    _createClass(_class, [{
        key: 'byUsernameAndPassword',
        value: function byUsernameAndPassword(username, password, done) {
            var self = this;

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
    }, {
        key: 'successLoginInMiddleware',
        value: function successLoginInMiddleware(account, req, next, settings) {
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
        }
    }]);

    return _class;
}();

exports.default = _class;