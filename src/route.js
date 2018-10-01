import { getConfig } from './config';
import { authMiddleware } from './authentication';

// Login
export function loginRoute (app, options) {
    app.post(
        '/api/login', 
        authMiddleware('auth.api'), 
        options.action || getConfig('actions.login')
    );
}

// Refresh token
var refreshToken = function (req, res) {
    req
        .token()
        .refresh(req.headers.authorization, req.body.refresh_token)
        .then(token => {
            res.json({
                'error' : false,
                'response' : {
                    'token' : token
                }
            });
        })
        .catch(err => { 
            console.log(err);

            res.send('fail doJWTLogin');
        });
}

export function refreshTokenRoute (app, options) {
    app.post(
        '/api/refresh_token', 
        authMiddleware('defend.jwt', {
            'check_expire' : false
        }), 
        options.action || refreshToken
    );
}

//Logout
var logout = function (req, res) {
    req.logout();

    res.json({
        'error' : false
    });
}

export function logoutRoute (app, options) {
    app.get(
        '/api/logout', 
        authMiddleware('defend.jwt'), 
        options.action || logout
    );
}