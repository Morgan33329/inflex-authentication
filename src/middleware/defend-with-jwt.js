'use strict';

import passport from 'passport';
import {
    Strategy as jwtStrategy,
    ExtractJwt as extractJwt
} from 'passport-jwt';
import _ from 'lodash';

import logout from './../services/logout';
import Jwt from './../services/token/jwt';
import database from './../database';
import tokenGenerators from './../helpers/token';
import { getConfig } from './../config';
import { createObject } from './../helpers/user';
import { middleware as routeMiddleware } from './../helpers/version';
import { defineSettings, settingsByUrl } from './../helpers/settings';
import { JwtVerifier } from 'passport-jwt/lib/strategy';

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
            secretOrKey : process.env.JWT_SECRET || 'DqOlYSMMLZCr8JxSffaQ7Kpe7sd9s28M4UjJVyrvHD0GcUSqke1bCYoAXk7EHr1BKxy16xiUi0WEfKsFonxxHJeAwlva0qdN9L4b',

            passReqToCallback : true
        };

    strategyAdded = true;

    passport.use(new jwtStrategy(opts, function(req, jwt_payload, done) {
        let settings,
        
            jwtService = new Jwt();

        if (req.tokenSettings) {
            settings = req.tokenSettings;

            delete req.tokenSettings;
        } else
            settings = defaultSettings;

        let userData = jwtService.decryptData(jwt_payload.token_hash);

        database()
            .repository('identity')
            .findOneById(userData.identity || 0)
            .then(identity => {
                if (!identity) {
                    log('User (' + userData.identity + ') from token not found');
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

                createObject(userData)
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
