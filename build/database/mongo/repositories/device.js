'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = function () {
    if (!deviceRepository) deviceRepository = new DeviceRepository();

    return deviceRepository;
};

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _device = require('./../models/device');

var _device2 = _interopRequireDefault(_device);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var deviceRepository;

var DeviceRepository = function () {
    function DeviceRepository() {
        _classCallCheck(this, DeviceRepository);
    }

    _createClass(DeviceRepository, [{
        key: 'insert',
        value: function insert(data) {
            return new _bluebird2.default(function (resolve) {
                return _device2.default.create(data, function (err, result) {
                    resolve(result);
                });
            });
        }
    }, {
        key: 'update',
        value: function update(id, data) {
            var self = this;

            return new _bluebird2.default(function (resolve) {
                _device2.default.updateOne({
                    '_id': id
                }, data, function () {
                    self.findOneById(id).then(function (device) {
                        resolve(device);
                    });
                });
            });
        }
    }, {
        key: 'findOneById',
        value: function findOneById(id) {
            return new _bluebird2.default(function (resolve) {
                _device2.default.findById(id).exec(function (err, result) {
                    resolve(result);
                });
            });
        }
    }, {
        key: 'findOneByDeviceId',
        value: function findOneByDeviceId(deviceId) {
            return new _bluebird2.default(function (resolve) {
                _device2.default.findOne({
                    'device_id': deviceId
                }).exec(function (err, result) {
                    resolve(result);
                });
            });
        }
    }, {
        key: 'disableAllExceptThis',
        value: function disableAllExceptThis(device) {
            return new _bluebird2.default(function (resolve) {
                _device2.default.updateMany({
                    "$and": [{ 'id': { "$ne": device.id } }, { 'identity_id': device.identity_id }]
                }, {
                    'disabled': true,
                    'refresh_token': ''
                }, function () {
                    resolve();
                });
            });
        }
    }, {
        key: 'disableAll',
        value: function disableAll(identity) {
            return new _bluebird2.default(function (resolve) {
                _device2.default.updateMany({ 'identity_id': identity }, {
                    'disabled': true,
                    'refresh_token': ''
                }, function () {
                    resolve();
                });
            });
        }
    }, {
        key: 'findOneByDeviceIdAndIdentity',
        value: function findOneByDeviceIdAndIdentity(deviceId, identityId) {
            return new _bluebird2.default(function (resolve) {
                _device2.default.findOne({
                    'device_id': deviceId,
                    'identity_id': identityId
                }).exec(function (err, result) {
                    resolve(result);
                });
            });
        }
    }]);

    return DeviceRepository;
}();