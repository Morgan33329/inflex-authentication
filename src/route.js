import { action as routeAction } from './helpers/version';
import { authMiddleware } from './authentication';

// Login
export function loginRoute (app, options, version) {
    app.post(
        (version ? '/' + version : '') + '/api/login', 
        authMiddleware('auth.api', {}, options.middleware), 
        (req, res, next) => {
            routeAction('login', version, options.action)(req, res, next);
        }
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
            return res.status(422).json({ 
                'error' : true,
                "code" : '4220103',
                "type" : '',
                "title" : 'Invalid refresh token',
                "detail" : 'Invalid refresh token: ' + req.body.refresh_token
            });
        });
}

export function refreshTokenRoute (app, options, version) {
    app.post(
        (version ? '/' + version : '') + '/api/refresh_token', 
        authMiddleware('defend.jwt', {
            'check_expire' : false
        }, options.middleware), 
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

export function logoutRoute (app, options, version) {
    app.get(
        (version ? '/' + version : '') + '/api/logout', 
        authMiddleware('defend.jwt', {}, options.middleware), 
        options.action || logout
    );
}