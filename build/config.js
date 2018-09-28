'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setConfig = setConfig;
exports.getConfig = getConfig;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _database = require('./database');

var _database2 = _interopRequireDefault(_database);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultSettings = {
    'host': _os2.default.hostname(),

    'validateInputs': {
        'email': function email(check) {
            return check.isEmail();
        },
        'password': function password(check) {
            return check.isMD5();
        }
    },

    'loginWith': {
        'email': 1
    },

    'database': {
        'type': 'mongo'
    },

    'mailTransport': {
        'service': 'gmail',
        'auth': {
            'user': process.env.MAIL_USERNAME || '',
            'pass': process.env.MAIL_PASSWORD || ''
        }
    }
};
var settings = defaultSettings;

function setConfig(cnf) {
    settings = _lodash2.default.merge(defaultSettings, cnf);

    if (typeof settings.loginWith === 'string') {
        var objectLoginWIth = {};

        objectLoginWIth[settings.loginWith] = 1;

        settings.loginWith = objectLoginWIth;
    }

    var db = (0, _database2.default)();

    db.checkConfig(settings.database);
}

function getConfig(key) {
    return _lodash2.default.get(settings, key);
}