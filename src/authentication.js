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
    } else
        return getConfig();
}

export function addAction (type, version, action) {
    if (!action && typeof version === 'function') {
        action  = version;
        version = 'default';
    }

    version = version.replace('.', '_');

    changeConfig('functions.' + version + '.actions.' + type, action);
}

export function addMiddleware (type, version, middleware) {
    if (!middleware && typeof version === 'function') {
        middleware = version;
        version    = 'default';
    }

    version = version.replace('.', '_');
    
    changeConfig('functions.' + version + '.middleware.' + type, middleware);
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
export function authRoutes (app, version, options = null) {
    if (typeof version === 'object' && !options) {
        options = version;
        version = null;
    }

    version = version || '';
    options = options || {};

    loginRoute(app, options.login || {}, version);

    logoutRoute(app, options.logout || {}, version);

    refreshTokenRoute(app, options.refreshToken || {}, version);
}

export function authMiddleware (type, options, middleware) {
    switch (type) {
        case 'auth.api':
            return loginWithApi(options, middleware);
        case 'defend.jwt':
            return defendWithJwt(options, middleware);
    }
}