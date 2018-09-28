'use strict';

const dir = process.env.DEVELOPER === true ? 'src' : 'build'; 

const database = require('./' + dir + '/database').default();

exports.getType = function() { 
    return database.getType();
};

exports.getId = function(object) {
    return database.getId(object);
};

exports.repository = function(type) {
    return database.repository(type);
};

exports.model = function(model) {
    return database.model(model);
};