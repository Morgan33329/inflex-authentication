'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (settings, middleware) {
    settings = settings || {};
    settings = _lodash2.default.merge(doLoginSettings, settings);

    var ret = middleware || [];

    defineStrategy(settings);

    ret = (0, _login.appendInputValidation)(ret, settings);

    ret.push(function (req, res, next) {
        return _passport2.default.authenticate('local', function (err, account) {
            if (!err && account) {
                console.log("Authentication success");

                (0, _login.successLoginInMiddleware)(account, req, next, settings);
            } else if (err) {
                console.log("Error: passport authenticate error");

                next(err);
            } else {
                console.log("Authentication failed");

                settings.invalidAuthenticate(res);
            }
        })(req, res, next);
    });

    return ret;
};

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportLocal = require('passport-local');

var _login = require('./../helpers/login');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var doLoginSettings = {
    'usernameField': 'username',
    'passwordField': 'password',

    'session': false,

    'invalidAuthenticate': function invalidAuthenticate(res) {
        return res.status(401).json({
            'error': true,
            "code": '4010101',
            "type": '',
            "title": 'Invalid username or password',
            "detail": 'Invalid username or password'
        });
    },

    'invalidRequest': function invalidRequest(req, res, errors) {
        return res.status(422).json({
            'error': true,
            "code": '4220102',
            "type": '',
            "title": 'Invalid authorization request',
            "detail": 'Invalid authorization request: ' + JSON.stringify(errors)
        });
    }
};

function defineStrategy(settings) {
    var self = this;

    _passport2.default.use(new _passportLocal.Strategy({
        usernameField: settings.usernameField,
        passwordField: settings.passwordField
    }, function (username, password, done) {
        (0, _login.byUsernameAndPassword)(username, password, done);
    }));
}