'use strict';

const dir = process.env.DEVELOPER === true ? 'src' : 'build'; 

const user = require('./' + dir + '/helpers/user');

const login = require('./' + dir + '/helpers/login');

module.exports = {
    'createObject' : user.createObject,
    
    'successLoginInMiddleware' : login.successLoginInMiddleware
};