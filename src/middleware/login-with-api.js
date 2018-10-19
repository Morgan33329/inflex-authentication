import _ from 'lodash';
import passport from 'passport';
import { Strategy } from 'passport-local';

import {
    byUsernameAndPassword,
    appendInputValidation,
    successLoginInMiddleware
} from './../helpers/login';
import { getConfig } from './../config';
import { defineSettings, settingsByVersion } from './../helpers/settings';

const defaultSettings = {
    'version' : 'default',

    'usernameField' : 'username',
    'passwordField' : 'password',

    'session' : false,

    'invalidAuthenticate' : function(res) {
        return res.status(401).json({ 
            'success' : false,
            'error' : {
                'code' : '4010101',
                'type' : '',
                'title' : 'Invalid username or password',
                'detail' : 'Invalid username or password'
            }
        });
    },

    'invalidRequest' : function(req, res, errors) {
        return res.status(422).json({ 
            'success' : false,
            'error' : {
                'code' : '4220102',
                'type' : '',
                'title' : 'Invalid authorization request',
                'detail' : 'Invalid authorization request: ' + JSON.stringify(errors)
            }
        });
    }
};
var versionSettings = {};

function log (data) {
    let l = getConfig('log');

    l(data);
}


var strategyAdded = {};
function defineStrategy (settings) { 
    if (strategyAdded[settings.version])
        return;

    strategyAdded[settings.version] = true;

    passport.use('local-' + settings.version, new Strategy({
        usernameField: settings.usernameField,
        passwordField: settings.passwordField
    }, (username, password, done) => { console.log(username, password);
        byUsernameAndPassword(username, password, done);
    }));
}
 
export default function (options, middleware) {
    let version = options && options.version || 'default';
    
    middleware      = middleware || [];
    versionSettings = defineSettings(version, options, versionSettings, defaultSettings);

    let settings = settingsByVersion(version, versionSettings),
        ret      = middleware || []

    defineStrategy(settings);

    ret = appendInputValidation(ret, settings);

    ret.push(
        function (req, res, next) {
            return passport.authenticate('local-' + settings.version, function(err, account) {
                if (!err && account) {
                    log('Authentication success');

                    successLoginInMiddleware(account, req, next, settings);
                } else if (err) {
                    log('Error: passport authenticate error');

                    next(err);
                } else {
                    log('Authentication failed');

                    settings.invalidAuthenticate(res);
                }
            })(req, res, next);
        }
    );

    return ret;
}