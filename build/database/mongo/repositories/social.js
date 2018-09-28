'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = function () {
    if (!passwordRepository) passwordRepository = new PasswordRepository();

    return passwordRepository;
};

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _social = require('./../models/social');

var _social2 = _interopRequireDefault(_social);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var passwordRepository;

var PasswordRepository = function () {
    function PasswordRepository() {
        _classCallCheck(this, PasswordRepository);
    }

    _createClass(PasswordRepository, [{
        key: 'findOneById',
        value: function findOneById(id) {
            return new _bluebird2.default(function (resolve) {
                _social2.default.findById(id).exec(function (err, result) {
                    resolve(result);
                });
            });
        }
    }]);

    return PasswordRepository;
}();