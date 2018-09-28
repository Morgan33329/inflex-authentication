'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var passwordSchema = _mongoose2.default.Schema({
    identity_id: _mongoose2.default.Schema.ObjectId,

    password: String,

    expired_at: Date,

    created_at: Date
});

passwordSchema.pre('save', function (next) {
    var now = new Date();

    if (!this.created_at) this.created_at = now;

    next();
});

exports.default = _mongoose2.default.model('user_password', passwordSchema);