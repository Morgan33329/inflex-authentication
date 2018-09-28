'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (settings, middlewares) {
    middlewares = middlewares || [];

    settings = _lodash2.default.merge(doJwtSettings, settings);

    defineStrategy(settings);

    middlewares.push(_passport2.default.authenticate('jwt', { session: false }));

    middlewares.push(function (req, res, next) {
        req.token = function (type) {
            type = type || "jwt";

            var generator = (0, _token2.default)(type);

            if (generator) {
                generator.user(req.user);

                return generator;
            } else {
                process.exit(1);
            }
        };

        req.logout = function () {
            var lo = new _logout2.default();

            lo.user(req.user);

            lo.logout();
        };

        next();
    });

    return middlewares;
};

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportJwt = require('passport-jwt');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _logout = require('./../services/logout');

var _logout2 = _interopRequireDefault(_logout);

var _database = require('./../database');

var _database2 = _interopRequireDefault(_database);

var _user = require('./../helpers/user');

var _token = require('./../helpers/token');

var _token2 = _interopRequireDefault(_token);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var doJwtSettings = {
    'expire': null
};

function Validate() {
    var ir = require('./../../repositories/identity');

    this.identityRepository = new ir();

    this.userService = new UserService();
}

function defineStrategy(settings) {
    var self = this,
        opts = {
        'jwtFromRequest': _passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
        'secretOrKey': process.env.JWT_SECRET || 'OFcKgPZjWyLPlpXe80WMR6qRGJKG7RLD'
    };

    _passport2.default.use(new _passportJwt.Strategy(opts, function (jwt_payload, done) {
        console.log(jwt_payload);
        (0, _database2.default)().repository('identity').findOneById(jwt_payload.identity || 0).then(function (identity) {
            if (identity) {
                var seconds = new Date().getTime() / 1000,
                    isExpired = settings.check_expire !== false && jwt_payload.expired_at > 0 && jwt_payload.expired_at > seconds;

                if (!isExpired) {
                    (0, _user.createObject)(jwt_payload).then(function (user) {
                        console.log("Ide eljut", user);
                        if (user.device.disabled === false) {
                            return done(null, user);
                        } else {
                            console.log('This device is logged out');

                            done(null, false);
                        }
                    }).catch(function (err) {
                        console.log(err);

                        done(null, false);
                    });
                } else {
                    console.log('This token is expired');

                    done(null, false);
                }
            } else {
                console.log('User (' + jwt_payload.user + ') from token not found');

                done(null, false);
            }
        }).catch(function (err) {
            console.log('ERROR: ' + err);

            done(null, false);
        });
    }));
};