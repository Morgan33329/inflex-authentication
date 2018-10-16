'use strict';

import passport from 'passport';
import {
    Strategy as jwtStrategy,
    ExtractJwt as extractJwt
} from 'passport-jwt';
import _ from 'lodash';

import { getConfig } from './../config';
import logout from './../services/logout';
import database from './../database';
import { createObject } from './../helpers/user'
import tokenGenerators from './../helpers/token';

const doJwtSettings = {
    'expire' : null,

    'check_expire' : true
};

function log (data) {
    let l = getConfig('log');

    l(data);
}

var strategyAdded;
function defineStrategy(settings) {
    if (strategyAdded)
        return;

    let opts = {
            'jwtFromRequest' : extractJwt.fromAuthHeaderAsBearerToken(),
            'secretOrKey' : process.env.JWT_SECRET || 'OFcKgPZjWyLPlpXe80WMR6qRGJKG7RLD'
        };

    strategyAdded = true;

    passport.use(new jwtStrategy(opts, function(jwt_payload, done) {
        database()
            .repository('identity')
            .findOneById(jwt_payload.identity || 0)
            .then(identity => {
                if (!identity) {
                    log('User (' + jwt_payload.identity + ') from token not found');
                    return done(null, false);
                } else if (identity.activated !== true) {
                    log('This user is not activated in email');
                    return done(null, false);
                }

                let seconds   = new Date().getTime() / 1000,
                    isExpired = settings.check_expire !== false && jwt_payload.expired_at > 0 && jwt_payload.expired_at > seconds;

                if (isExpired) {
                    log('This token is expired');
                    return done(null, false);
                }

                createObject(jwt_payload)
                    .then(user => {
                        if (user.device.disabled === false) {
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
    let tokenMiddle = getConfig('middleware.token');

    if (tokenMiddle)
        tokenMiddle(req, res);

    next();
}

export default function (settings, middleware) {
    middleware = middleware || [];

    settings = _.merge(doJwtSettings, settings);

    defineStrategy(settings);

    middleware.push(
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
