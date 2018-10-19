'use strict';

const dir = ["true", "1", 1, true].indexOf(process.env.DEVELOPER) != -1 ? 'src' : 'lib'; 

const user = require('./' + dir + '/helpers/user');

const login = require('./' + dir + '/helpers/login');

const version = require('./' + dir + '/helpers/version');

const settings = require('./' + dir + '/helpers/settings');

module.exports = {
    'createObject' : user.createObject,
    
    'successLoginInMiddleware' : login.successLoginInMiddleware,

    'routeAction' : version.action,

    'routeMiddleware' : version.middleware,

    'defineSettings' : settings.defineSettings,

    'settingsByUrl' : settings.settingsByUrl,

    'settingsByVersion' : settings.settingsByVersion
};