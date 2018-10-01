'use strict';

const dir = ["true", "1", 1, true].indexOf(process.env.DEVELOPER) != -1 ? 'src' : 'lib'; 

const user = require('./' + dir + '/helpers/user');

const login = require('./' + dir + '/helpers/login');

module.exports = {
    'createObject' : user.createObject,
    
    'successLoginInMiddleware' : login.successLoginInMiddleware
};