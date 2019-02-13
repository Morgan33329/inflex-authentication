import Promise from 'bluebird';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import { getConfig } from './../../config';
import database from './../../database';
import {
    getAuthKeys
} from './../../helpers/user';

import DeviceService from './../device/device';
import DeviceDisableService from './../device/disable';

var tokenType = 'bearer';

export default class Token {
    constructor () {
        this.deviceService = new DeviceService();

        this.log = getConfig('log');
    }

    user (user) {
        this.userObject = user;

        this.deviceService
            .user(user);

        return this;
    }

    generate (options, expire = 0, customContent = null) {
        var self = this;    

        var createDevice = new Promise((resolve) => {
            self.deviceService
                .create(options)
                .then(device => {
                    resolve(device);
                });
        });

        return createDevice
            .then(device => { 
                var expiredAt = expire || 0,
                
                    jwtContent = customContent || {},
                    object     = getAuthKeys(self.userObject);

                object.device    = database().getId(device);
                object.timestamp = Date.now();

                jwtContent = {
                    token_hash : self.encryptData(object)
                };

                if (expiredAt > 0)
                    jwtContent["expire"] = Math.round((new Date().getTime() / 1000) + expiredAt);

                let refreshToken = generateRefreshToken(object.identity);

                return generateJsonWebToken(jwtContent, device, refreshToken)
                    .then(token => {
                        var disable = new DeviceDisableService();

                        disable.device(device);

                        return Promise.resolve({
                            "token" : token,
                            "disable" : disable
                        });
                    });
            });
    }

    encryptData (data) {
        return encrypt(JSON.stringify(data));
    }

    decryptData (data) {
        return JSON.parse(decrypt(data));
    }

    decode (token) {
        var decoded = jwt.decode(token);

        if (decoded) {
            return decoded;
        }

        return null;
    }

    refresh (token, refreshToken, expire = 0, newRefreshToken = false) {
        token = token
            .replace(tokenType, "")
            .replace(" ", "");

        this.log('Try to refresh this token: ' + token + ' with ' + refreshToken);

        let decodedToken = this.decode(token);

        if (decodedToken) {
            if (decodedToken.iat)
                delete decodedToken.iat;

            let userData = JSON.parse(decrypt(decodedToken.token_hash));

            return database()
                .repository('device')
                .findOneById(userData.device)
                .then(device => {
                    if (!device)
                        return Promise.reject("Device not found for this token");
                    else if (device.refresh_token != refreshToken)
                        return Promise.reject("AAAA Invalid refresh token");

                    var expiredAt = expire || 0;
                    
                    if (expiredAt > 0)
                        decodedToken["expire"] = Math.round((new Date().getTime() / 1000) + expiredAt);

                    let uploadRefreshToken = newRefreshToken 
                        ? generateRefreshToken(userData.identity)
                        : refreshToken;

                    return generateJsonWebToken(decodedToken, device, uploadRefreshToken)
                        .then(token => {
                            if (!newRefreshToken)
                                token.refresh_token = refreshToken;

                            return token;
                        });
                });
        } else
            return Promise.reject("Invalid token");
    }
}

function generateJsonWebToken (jwtContent, device, refreshToken) {
    let log = getConfig('log'),
    
        jwtKey = process.env.JWT_SECRET || 'DqOlYSMMLZCr8JxSffaQ7Kpe7sd9s28M4UjJVyrvHD0GcUSqke1bCYoAXk7EHr1BKxy16xiUi0WEfKsFonxxHJeAwlva0qdN9L4b',
        
        deviceId = database().getId(device);

    return database()
        .repository('device')
        .update(deviceId, {
            "refresh_token" : refreshToken,
            "disabled" : false
        })
        .then(device => {
            log("Token generated");

            return {
                "refresh_token" : refreshToken,
                'token_type' : tokenType.charAt(0).toUpperCase() + tokenType.slice(1),
                "access_token" : jwt.sign(jwtContent, jwtKey),
                "expires_in" : jwtContent["expire"] || 0
            };
        });
}

function generateRefreshToken (identity) {
    return crypto.createHash('md5').update(identity + "_" + new Date().getTime()).digest("hex");
}

function encrypt (text) {
    var cipher = crypto.createCipher('aes-256-cbc','d6F3Efeq');
    var crypted = cipher.update(text,'utf8','hex');

    crypted += cipher.final('hex');

    return crypted;
}
  
function decrypt (text) {
    var decipher = crypto.createDecipher('aes-256-cbc','d6F3Efeq');
    var dec = decipher.update(text,'hex','utf8');

    dec += decipher.final('utf8');

    return dec;
}