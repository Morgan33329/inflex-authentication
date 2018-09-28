'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createObject = createObject;
exports.getAuthKeys = getAuthKeys;

var _database = require('./../database');

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createObject(user) {
    var getIdentity = new Promise(function (resolve) {
        if (!user.identity) return resolve(null);

        (0, _database2.default)().repository('identity').findOneById(user.identity).then(function (identity) {
            resolve(identity);
        });
    });

    var getPassword = new Promise(function (resolve) {
        if (!user.password) return resolve(null);

        (0, _database2.default)().repository('password').findOneById(user.password).then(function (password) {
            resolve(password);
        });
    });

    var getAccount = new Promise(function (resolve) {
        if (!user.account) return resolve(null);

        (0, _database2.default)().repository('account').findOneById(user.account).then(function (account) {
            resolve(account);
        });
    });

    var getDevice = new Promise(function (resolve) {
        if (!user.device) return resolve(null);

        (0, _database2.default)().repository('device').findOneById(user.device).then(function (device) {
            resolve(device);
        });
    });

    var getSocial = new Promise(function (resolve) {
        if (!user.social) return resolve(null);

        (0, _database2.default)().repository('social').findOneById(user.social).then(function (social) {
            resolve(social);
        });
    });

    return Promise.all([getIdentity, getPassword, getAccount, getDevice, getSocial]).then(function (values) {
        var identity = values[0],
            password = values[1],
            account = values[2],
            device = values[3],
            social = values[4],
            response = {};

        response['user'] = identity;
        response['password'] = password;
        response['account'] = account;
        response['device'] = device;
        response['social'] = social;

        return response;
    }).catch(function (err) {
        throw err;
    });
}

function getAuthKeys(user) {
    var response = {
        identity: (0, _database2.default)().getId(user.user)
    };

    if (user.password) response['password'] = (0, _database2.default)().getId(user.password);

    if (user.account) response['account'] = (0, _database2.default)().getId(user.account);

    if (user.device) response['device'] = (0, _database2.default)().getId(user.device);

    if (user.social) response['social'] = (0, _database2.default)().getId(user.social);

    return response;
}