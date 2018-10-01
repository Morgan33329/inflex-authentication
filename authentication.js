'use strict';

const dir = ["true", "1", 1, true].indexOf(process.env.DEVELOPER) != -1 ? 'src' : 'lib'; 

const authentication = require('./' + dir + '/authentication');

exports.authConfig = authentication.authConfig;

exports.authExpress = authentication.authExpress;

exports.authRoutes = authentication.authRoutes;

exports.needLogin = function(options, middleware) {
    return authentication.authMiddleware('defend.jwt', options, middleware)
}
