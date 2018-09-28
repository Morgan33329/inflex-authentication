'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = function () {
    if (!accountRepository) accountRepository = new AccountRepository();

    return accountRepository;
};

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _account = require('./../models/account');

var _account2 = _interopRequireDefault(_account);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var accountRepository;

var AccountRepository = function () {
    function AccountRepository() {
        _classCallCheck(this, AccountRepository);
    }

    _createClass(AccountRepository, [{
        key: 'findOneById',
        value: function findOneById(id) {
            return new _bluebird2.default(function (resolve) {
                _account2.default.findById(id).exec(function (err, result) {
                    resolve(result);
                });
            });
        }
    }, {
        key: 'findByAccount',
        value: function findByAccount(account) {
            return new _bluebird2.default(function (resolve) {
                _account2.default.findOne({
                    'account': account
                }).exec(function (err, results) {
                    resolve(results);
                });
            });
        }
    }]);

    return AccountRepository;
}();