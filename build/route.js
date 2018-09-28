"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loginRoute = loginRoute;
exports.refreshTokenRoute = refreshTokenRoute;
exports.logoutRoute = logoutRoute;

var _authentication = require("./authentication");

var loginSuccess = function loginSuccess(req, res) {
    req.token().generate(req.body.device).then(function (ret) {
        ret.disable.exceptMe();

        res.json({
            "error": false,
            "response": {
                "token": ret.token
            }
        });
    }).catch(function (err) {
        console.log(err);

        res.send("fail doJWTLogin");
    });
};

function loginRoute(app, action) {
    app.post("/api/login", (0, _authentication.authMiddleware)('auth.api'), action || loginSuccess);
}

var refreshToken = function refreshToken(req, res) {
    req.token().refresh(req.headers.authorization, req.body.refresh_token).then(function (token) {
        res.json({
            "error": false,
            "response": {
                "token": token
            }
        });
    }).catch(function (err) {
        console.log(err);

        res.send("fail doJWTLogin");
    });
};

function refreshTokenRoute(app, action) {
    app.post("/api/refresh_token", (0, _authentication.authMiddleware)('defend.jwt', {
        "check_expire": false
    }), action || refreshToken);
}

var logout = function logout(req, res) {
    req.logout();

    res.json({
        "error": false
    });
};

function logoutRoute(app, action) {
    app.post("/api/logout", (0, _authentication.authMiddleware)('defend.jwt'), action || logout);
}