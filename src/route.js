import {
    authMiddleware
} from "./authentication";

var loginSuccess = function (req, res) {
    req
        .token()
        .generate(req.body.device)
        .then((ret) => {
            ret.disable.exceptMe();

            res.json({
                "error" : false,
                "response" : {
                    "token" : ret.token
                }
            });
        })
        .catch(err => { 
            console.log(err);

            res.send("fail doJWTLogin");
        });
}

export function loginRoute (app, action) {
    app.post(
        "/api/login", 
        authMiddleware('auth.api'), 
        action || loginSuccess
    );
}


var refreshToken = function (req, res) {
    req
        .token()
        .refresh(req.headers.authorization, req.body.refresh_token)
        .then(token => {
            res.json({
                "error" : false,
                "response" : {
                    "token" : token
                }
            });
        })
        .catch(err => { 
            console.log(err);

            res.send("fail doJWTLogin");
        });
}

export function refreshTokenRoute (app, action) {
    app.post(
        "/api/refresh_token", 
        authMiddleware('defend.jwt', {
            "check_expire" : false
        }), 
        action || refreshToken
    );
}


var logout = function (req, res) {
    req.logout();

    res.json({
        "error" : false
    });
}


export function logoutRoute (app, action) {
    app.get(
        "/api/logout", 
        authMiddleware('defend.jwt'), 
        action || logout
    );
}