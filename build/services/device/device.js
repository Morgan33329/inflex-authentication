'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _database = require('./../../database');

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class() {
        _classCallCheck(this, _class);
    }

    _createClass(_class, [{
        key: 'user',
        value: function user(_user) {
            this.userObject = _user;

            return this;
        }
    }, {
        key: 'device',
        value: function device(_device) {
            this.device = _device;

            return this;
        }
    }, {
        key: 'create',
        value: function create(options) {
            options = options || {};

            var self = this,
                id = options.id || 'web';

            return (0, _database2.default)().repository('device').findOneByDeviceIdAndIdentity(id, (0, _database2.default)().getId(this.userObject.user)).then(function (device) {
                if (!device) {
                    console.log('Device not found: ' + id);

                    return (0, _database2.default)().repository('device').insert({
                        'identity_id': (0, _database2.default)().getId(self.userObject.user),
                        'device_id': id
                    }).then(function (savedDevice) {
                        console.log('Device uploaded');

                        return savedDevice;
                    }).catch(function (err) {
                        throw err;
                    });
                } else {
                    console.log('Device found: ' + id);

                    return device;
                }
            }).then(function (device) {
                self.device = device;

                return self.update(options);
            }).catch(function (err) {
                throw err;
            });
        }
    }, {
        key: 'update',
        value: function update(options) {
            var update = {},
                deviceId = (0, _database2.default)().getId(this.device);

            if (options.type) {
                if (options.type == 1 || options.type == 'ios') update.device_type = 1;else if (options.type == 2 || options.type == 'android') update.device_type = 1;
            }

            if (options.push) update.device_push = options['push'];

            if (options.language) update.device_language = options['language'];

            return (0, _database2.default)().repository('device').update(deviceId, update).then(function (device) {
                console.log('Device updated: ' + JSON.stringify(options));

                return device;
            });
        }
    }]);

    return _class;
}();

exports.default = _class;