'use strict';

const dir = process.env.DEVELOPER ? 'src' : 'build'; 

const user = require('./' + dir + '/helpers/user');

const login = require('./' + dir + '/helpers/login');

module.exports = {
    'createObject' : user.createObject,
    
    'successLoginInMiddleware' : login.successLoginInMiddleware
};