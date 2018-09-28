import _ from 'lodash';
import database from './database';
import os from 'os';

const defaultSettings = {
    'host' : os.hostname(),
    
    'validateInputs' : {
        'email' : function(check) {
            return check.isEmail();
        },
        'password' : function(check) {
            return check.isMD5();
        }
    },

    'loginWith' : {
        'email' : 1
    },

    'database' : {
        'type': 'mongo'
    },

    'mailTransport' : {
        'service' : 'gmail',
        'auth' : {
            'user' : process.env.MAIL_USERNAME || '',
            'pass' : process.env.MAIL_PASSWORD || ''
        }
    }
};
var settings = defaultSettings;

export function setConfig (cnf) {
    settings = _.merge(defaultSettings, cnf);
    
    if (typeof settings.loginWith === 'string') {
        let objectLoginWIth = {};

        objectLoginWIth[settings.loginWith] = 1;

        settings.loginWith = objectLoginWIth
    }

    let db = database();

    db.checkConfig(settings.database);
}

export function getConfig (key) {
    return _.get(settings, key);
}