'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    var databaseName = (0, _config.getConfig)('database.type');

    if (!databaseName) {
        console.log(new Error('Database type not set!'));
        process.exit();
    }

    switch (databaseName) {
        case 'mongo':
            return (0, _mongo2.default)();
            break;
    }
};

var _mongo = require('./database/mongo');

var _mongo2 = _interopRequireDefault(_mongo);

var _config = require('./config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }