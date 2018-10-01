'use strict';

const dir = ["true", "1", 1, true].indexOf(process.env.DEVELOPER) != -1 ? 'src' : 'lib'; 

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