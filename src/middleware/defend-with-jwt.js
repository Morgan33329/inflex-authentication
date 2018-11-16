'use strict';

import passport from 'passport';
import {
    Strategy as jwtStrategy,
    ExtractJwt as extractJwt
} from 'passport-jwt';
import _ from 'lodash';

import logout from './../services/logout';
import database from './../database';
import tokenGenerators from './../helpers/token';
import { getConfig } from './../config';
import { createObject } from './../helpers/user';
import { middleware as routeMiddleware } from './../helpers/version';
import { defineSettings, settingsByUrl } from './../helpers/settings';

const defaultSettings = {
    'version' : 'default',

    'check_expire' : true
};

var versionSettings = {};

function log (data) {
    let l = getConfig('log');

    l(data);
}

var strategyAdded;
function defineStrategy() {
    if (strategyAdded)
        return;

    let opts = {
            jwtFromRequest : extractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey : process.env.JWT_SECRET || 'OFcKgPZjWyLPlpXe80WMR6qRGJKG7RLD',

            passReqToCallback : true
        };

    strategyAdded = true;

    passport.use(new jwtStrategy(opts, function(req, jwt_payload, done) {
        let settings;

        if (req.tokenSettings) {
            settings = req.tokenSettings;

            delete req.tokenSettings;
        } else
            settings = defaultSettings;

        database()
            .repository('identity')
            .findOneById(jwt_payload.identity || 0)
            .then(identity => {
                if (!identity) {
                    log('User (' + jwt_payload.identity + ') from token not found');
                    return done(null, false);
                } else if (!identity.activated) {
                    log('This user is not activated in email');
                    return done(null, false);
                }

                let seconds   = new Date().getTime() / 1000,
                    isExpired = settings.check_expire !== false && jwt_payload.expire > 0 && jwt_payload.expire < parseInt(seconds);

                if (isExpired) {
                    log('This token is expired');
                    return done(null, false);
                }

                createObject(jwt_payload)
                    .then(user => {
                        if (!user.device.disabled) {
                            return done(null, user);
                        } else {
                            log('This device is logged out');

                            done(null, false);
                        }
                    })
                    .catch(err => {
                        log(err);
        
                        done(null, false);
                    });

            })
            .catch(err => {
                log('ERROR: ' + err);

                done(null, false);
            });
    }));
};

var hasToken = function(req, res, next) {
    let middleware = routeMiddleware('token', req);

    if (middleware)
        return middleware(req, res, next);
    else
        next();
}

export default function (options, middleware) {
    let version = options && options.version || 'default';

    middleware      = middleware || [];

    defineStrategy();

    middleware.push(
        function (req, res, next) {
            req.tokenSettings = _.assign({}, defaultSettings, options);

            next();
        },

        passport.authenticate('jwt', { session: false }),

        hasToken
    );

    middleware.push(
        (req, res, next) => {
            req.token = function(type) {
                type = type || "jwt";
    
                var generator = tokenGenerators(type);
    
                if (generator) {
                    generator.user(req.user);
    
                    return generator;
                } else {
                    process.exit(1);
                }
            };
    
            req.logout = function() {
                var lo = new logout();
    
                lo.user(req.user);
    
                lo.logout();
            };

            next();
        }
    )

    return middleware;
}
