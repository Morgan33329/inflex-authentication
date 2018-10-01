import passport from 'passport';

import loginWithApi from './middleware/login-with-api';
import defendWithJwt from './middleware/defend-with-jwt';

import {
    loginRoute,
    logoutRoute,
    refreshTokenRoute
} from './route';
import {
    getConfig,
    setConfig,
    changeConfig
} from './config';

/**
 * Set authentication module's config or get value from config
 */
export function authConfig (configOrKey) {
    let type = typeof configOrKey;

    if (type === 'string') {
        return getConfig(configOrKey);
    } else if (type === 'object') {
        setConfig(configOrKey);
    }
}

export function addAction (type, action) {
    changeConfig('actions.' + type, action);
}

export function addMiddleware (type, middleware) {
    changeConfig('middleware.' + type, middleware);
}

/**
 * Add passport to express middleware
 */
export function authExpress (app) {
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done){
        done(null, user);
    });

    app.use(passport.initialize());
    app.use(passport.session());
}

/**
 * Create default routes for login if we are lazy
 */
export function authRoutes (app, options) {
    options = options || {};

    loginRoute(app, options.login || {});

    logoutRoute(app, options.logout || {});

    refreshTokenRoute(app, options.refreshToken || {});
}

export function authMiddleware (type, options, middleware) {
    switch (type) {
        case 'auth.api':
            return loginWithApi(options, middleware);
        case 'defend.jwt':
            return defendWithJwt(options, middleware);
    }
}