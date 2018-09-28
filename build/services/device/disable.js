'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _database = require('./../../database');

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function _class() {
    _classCallCheck(this, _class);

    this.device = function (device) {
        this.deviceData = device;
    };

    this.exceptMe = function () {
        console.log("All devices disabled");

        (0, _database2.default)().repository('device').disableAllExceptThis(this.deviceData);
    };
};

exports.default = _class;