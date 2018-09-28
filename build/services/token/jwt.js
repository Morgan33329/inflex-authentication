'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _database = require('./../../database');

var _database2 = _interopRequireDefault(_database);

var _user2 = require('./../../helpers/user');

var _device = require('./../device/device');

var _device2 = _interopRequireDefault(_device);

var _disable = require('./../device/disable');

var _disable2 = _interopRequireDefault(_disable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var tokenType = 'bearer';

var Token = function () {
    function Token(id, x, y) {
        _classCallCheck(this, Token);

        this.deviceService = new _device2.default();
    }

    _createClass(Token, [{
        key: 'user',
        value: function user(_user) {
            this.userObject = _user;

            this.deviceService.user(_user);

            return this;
        }
    }, {
        key: 'generate',
        value: function generate(options, expire) {
            var _this = this;

            var self = this;

            var createDevice = new _bluebird2.default(function (resolve) {
                self.deviceService.create(options).then(function (device) {
                    resolve(device);
                });
            });

            return createDevice.then(function (device) {
                var expire = expire || 0,
                    jwtContent;

                jwtContent = (0, _user2.getAuthKeys)(_this.userObject);

                if (expire > 0) jwtContent["expire"] = new Date().getTime() / 1000 + expire;

                return generateJsonWebToken(jwtContent, device).then(function (token) {
                    var disable = new _disable2.default();

                    disable.device(device);

                    return _bluebird2.default.resolve({
                        "token": token,
                        "disable": disable
                    });
                });
            });
        }
    }, {
        key: 'decode',
        value: function decode(token) {
            var decoded = _jsonwebtoken2.default.decode(token);

            if (decoded) {
                return decoded;
            }

            return null;
        }
    }, {
        key: 'refresh',
        value: function refresh(token, refreshToken) {
            token = token.replace(tokenType, "").replace(" ", "");

            var decodedToken = this.decode(token);

            if (decodedToken) {
                if (decodedToken.iat) delete decodedToken.iat;

                return (0, _database2.default)().repository('device').findOneById(decodedToken.device).then(function (device) {
                    if (!device) return _bluebird2.default.reject("Device not found for this token");else if (device.refresh_token != refreshToken) return _bluebird2.default.reject("Invalid refresh token");

                    return generateJsonWebToken(decodedToken, device);
                });
            } else return _bluebird2.default.reject("Invalid token");
        }
    }]);

    return Token;
}();

exports.default = Token;


function generateJsonWebToken(jwtContent, device) {
    var jwtKey = process.env.JWT_SECRET || 'OFcKgPZjWyLPlpXe80WMR6qRGJKG7RLD',
        refreshToken = generateRefreshToken(jwtContent.identity),
        deviceId = (0, _database2.default)().getId(device);

    jwtContent.device = deviceId;

    return (0, _database2.default)().repository('device').update(deviceId, {
        "refresh_token": refreshToken,
        "disabled": false,
        "device_push": "alma"
    }).then(function (device) {
        console.log("Token generated");

        return {
            "refresh_token": refreshToken,
            'token_type': tokenType,
            "access_token": _jsonwebtoken2.default.sign(jwtContent, jwtKey),
            "expires_in": jwtContent["expire"] || 0
        };
    });
}

function generateRefreshToken(identity) {
    return _crypto2.default.createHash('md5').update(identity + "_" + new Date().getTime()).digest("hex");
}