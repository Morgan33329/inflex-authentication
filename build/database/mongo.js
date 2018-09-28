'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = function () {
    if (!mongoClass) mongoClass = new Mongo();

    return mongoClass;
};

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _account = require('./mongo/repositories/account');

var _account2 = _interopRequireDefault(_account);

var _device = require('./mongo/repositories/device');

var _device2 = _interopRequireDefault(_device);

var _identity = require('./mongo/repositories/identity');

var _identity2 = _interopRequireDefault(_identity);

var _password = require('./mongo/repositories/password');

var _password2 = _interopRequireDefault(_password);

var _social = require('./mongo/repositories/social');

var _social2 = _interopRequireDefault(_social);

var _account3 = require('./mongo/models/account');

var _account4 = _interopRequireDefault(_account3);

var _device3 = require('./mongo/models/device');

var _device4 = _interopRequireDefault(_device3);

var _identity3 = require('./mongo/models/identity');

var _identity4 = _interopRequireDefault(_identity3);

var _hash = require('./mongo/models/hash');

var _hash2 = _interopRequireDefault(_hash);

var _password3 = require('./mongo/models/password');

var _password4 = _interopRequireDefault(_password3);

var _social3 = require('./mongo/models/social');

var _social4 = _interopRequireDefault(_social3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var mongoClass;

var Mongo = function () {
    function Mongo() {
        _classCallCheck(this, Mongo);
    }

    _createClass(Mongo, [{
        key: 'checkConfig',
        value: function checkConfig(cnf) {
            if (!cnf.host) {
                console.log('Missing host from mongodb database config database');
                process.exit();
            }

            this.connect(cnf.host);
        }
    }, {
        key: 'getType',
        value: function getType() {
            return 'mongo';
        }
    }, {
        key: 'getId',
        value: function getId(object) {
            return object._id;
        }
    }, {
        key: 'connect',
        value: function connect(host) {
            _mongoose2.default.connect(host, {
                useNewUrlParser: true
            });
        }
    }, {
        key: 'repository',
        value: function repository(type) {
            switch (type) {
                case 'account':
                    return (0, _account2.default)();
                case 'device':
                    return (0, _device2.default)();
                case 'identity':
                    return (0, _identity2.default)();
                case 'password':
                    return (0, _password2.default)();
                case 'social':
                    return (0, _social2.default)();
            }
        }
    }, {
        key: 'model',
        value: function model(_model) {
            switch (_model) {
                case 'account':
                    return _account4.default;
                case 'device':
                    return _device4.default;
                case 'identity':
                    return _identity4.default;
                case 'password':
                    return _password4.default;
                case 'hash':
                    return _hash2.default;
                case 'social':
                    return _social4.default;
                default:
                    console.log("Model type " + _model + " not found");
            }
        }
    }]);

    return Mongo;
}();