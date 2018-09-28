"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (type) {
    switch (type.toLowerCase()) {
        case "jwt":
            return new _jwt2.default();
            break;
        default:
            console.log("ERROR: Token generator: " + type + " not supported");
    }

    return null;
};

var _jwt = require("./../services/token/jwt");

var _jwt2 = _interopRequireDefault(_jwt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }