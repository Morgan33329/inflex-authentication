import _ from 'lodash';
import os from 'os';

const defaultSettings = {
    'host' : os.hostname(),
    
    'validateInputs' : {
        'email' : (check) => {
            return check.isEmail();
        },
        'password' : (check) => {
            return check.isMD5();
        }
    },

    'loginWith' : {
        'email' : 1
    },

    'database' : {
        'library': 'typeorm'
    },

    'log' : (data) => {
        //do something
    },

    'mailTransport' : {
        'service' : 'gmail',
        'auth' : {
            'user' : process.env.MAIL_USERNAME || '',
            'pass' : process.env.MAIL_PASSWORD || ''
        }
    },

    'functions' : {
        'default' : {
            'actions' : {
                'login' : (req, res) => {
                    req
                        .token()
                        .generate(req.body.device)
                        .then((ret) => {
                            ret.disable.exceptMe();
                
                            res.json({
                                "error" : false,
                                "response" : {
                                    "token" : ret.token
                                }
                            });
                        })
                        .catch(err => { 
                            console.error(err);
                
                            res.send("fail doJWTLogin");
                        });
                }
            }
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
}

export function getConfig (key) {
    return key
        ? _.get(settings, key)
        : settings;
}

export function changeConfig (key, value) {
    _.set(settings, key, value);
}