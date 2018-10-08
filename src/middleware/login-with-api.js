import _ from 'lodash';
import passport from 'passport';
import { Strategy } from 'passport-local';

import {
    byUsernameAndPassword,
    appendInputValidation,
    successLoginInMiddleware
} from './../helpers/login';

const doLoginSettings = {
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

function defineStrategy (settings) { 
    let self = this;

    passport.use(new Strategy({
        usernameField: settings.usernameField,
        passwordField: settings.passwordField
    }, (username, password, done) => {
        byUsernameAndPassword(username, password, done);
    }));
}
 
export default function (settings, middleware) {
    settings = settings || {};
    settings = _.merge(doLoginSettings, settings);

    let ret = middleware || [];

    defineStrategy(settings);

    ret = appendInputValidation(ret, settings);

    ret.push(
        function (req, res, next) {
            return passport.authenticate('local', function(err, account) {
                if (!err && account) {
                    console.log('Authentication success');

                    successLoginInMiddleware(account, req, next, settings);
                } else if (err) {
                    console.log('Error: passport authenticate error');

                    next(err);
                } else {
                    console.log('Authentication failed');

                    settings.invalidAuthenticate(res);
                }
            })(req, res, next);
        }
    );

    return ret;
}