'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.authConfig = authConfig;
exports.authExpress = authExpress;
exports.authRoutes = authRoutes;
exports.authMiddleware = authMiddleware;

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _loginWithApi = require('./middlewares/login-with-api');

var _loginWithApi2 = _interopRequireDefault(_loginWithApi);

var _defendWithJwt = require('./middlewares/defend-with-jwt');

var _defendWithJwt2 = _interopRequireDefault(_defendWithJwt);

var _route = require('./route');

var _config = require('./config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Set authentication module's config or get value from config
 */
function authConfig(configOrKey) {
    var type = typeof configOrKey === 'undefined' ? 'undefined' : _typeof(configOrKey);

    if (type === 'string') {
        return (0, _config.getConfig)(configOrKey);
    } else if (type === 'object') {
        console.log(type);
        (0, _config.setConfig)(configOrKey);
    }
}

/**
 * Add passport to express middleware
 */
function authExpress(app) {
    _passport2.default.serializeUser(function (user, done) {
        done(null, user);
    });

    _passport2.default.deserializeUser(function (user, done) {
        done(null, user);
    });

    app.use(_passport2.default.initialize());
    app.use(_passport2.default.session());
}

/**
 * Create default routes for login if we are lazy
 */
function authRoutes(app) {
    (0, _route.loginRoute)(app);

    (0, _route.logoutRoute)(app);

    (0, _route.refreshTokenRoute)(app);
}

function authMiddleware(type) {
    var middlewares = {
        'auth.api': (0, _loginWithApi2.default)(),
        'defend.jwt': (0, _defendWithJwt2.default)()
    };

    return middlewares[type];
}