'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var deviceSchema = _mongoose2.default.Schema({
    identity_id: _mongoose2.default.Schema.ObjectId,

    refresh_token: String,

    device_id: String,

    device_type: Number,

    device_push: String,

    device_language: String,

    is_guest: Boolean,

    disabled: Boolean,

    created_at: Date
});

deviceSchema.pre('save', function (next) {
    var now = new Date();

    if (!this.created_at) this.created_at = now;

    next();
});

exports.default = _mongoose2.default.model('user_device', deviceSchema);