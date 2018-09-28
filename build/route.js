'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loginRoute = loginRoute;
exports.refreshTokenRoute = refreshTokenRoute;
exports.logoutRoute = logoutRoute;

var _authentication = require('./authentication');

// Login
var loginSuccess = function loginSuccess(req, res) {
    req.token().generate(req.body.device).then(function (ret) {
        ret.disable.exceptMe();

        res.json({
            'error': false,
            'response': {
                'token': ret.token
            }
        });
    }).catch(function (err) {
        console.log(err);

        res.send('fail doJWTLogin');
    });
};

function loginRoute(app, options) {
    app.post('/api/login', (0, _authentication.authMiddleware)('auth.api'), options.action || loginSuccess);
}

// Refresh token
var refreshToken = function refreshToken(req, res) {
    req.token().refresh(req.headers.authorization, req.body.refresh_token).then(function (token) {
        res.json({
            'error': false,
            'response': {
                'token': token
            }
        });
    }).catch(function (err) {
        console.log(err);

        res.send('fail doJWTLogin');
    });
};

function refreshTokenRoute(app, options) {
    app.post('/api/refresh_token', (0, _authentication.authMiddleware)('defend.jwt', {
        'check_expire': false
    }), options.action || refreshToken);
}

//Logout
var logout = function logout(req, res) {
    req.logout();

    res.json({
        'error': false
    });
};

function logoutRoute(app, options) {
    app.get('/api/logout', (0, _authentication.authMiddleware)('defend.jwt'), options.action || logout);
}