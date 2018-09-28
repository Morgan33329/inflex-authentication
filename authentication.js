'use strict';

const dir = process.env.DEVELOPER ? 'src' : 'build'; 

const authentication = require('./' + dir + '/authentication');

exports.authConfig = authentication.authConfig;

exports.authExpress = authentication.authExpress;

exports.authRoutes = authentication.authRoutes;

exports.needLogin = function(options, middleware) {
    return authentication.authMiddleware('defend.jwt', options, middleware)
}