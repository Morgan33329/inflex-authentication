'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var identitySchema = _mongoose2.default.Schema({
    activated: {
        type: Boolean,
        default: true
    },

    enabled: {
        type: Boolean,
        default: true
    },

    blocked: Boolean,

    blocked_at: Date,

    created_at: Date,

    deleted_at: Date,

    updated_at: Date
});

identitySchema.pre('save', function (next) {
    var now = new Date();

    this.updated_at = now;

    if (!this.created_at) {
        this.created_at = now;
    }

    next();
});

exports.default = _mongoose2.default.model('user_identity', identitySchema);