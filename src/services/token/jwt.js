import Promise from 'bluebird';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

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
    }

    user (user) {
        this.userObject = user;

        this.deviceService
            .user(user);

        return this;
    }

    generate (options, expire) {
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
                var expire = expire || 0,
                
                    jwtContent;
        
                jwtContent = getAuthKeys(this.userObject);

                if (expire > 0)
                    jwtContent["expire"] = (new Date().getTime() / 1000) + expire;

                return generateJsonWebToken(jwtContent, device)
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

    decode (token) {
        var decoded = jwt.decode(token);

        if (decoded) {
            return decoded;
        }

        return null;
    }

    refresh (token, refreshToken) {
        token = token
            .replace(tokenType, "")
            .replace(" ", "");

        let decodedToken = this.decode(token);

        if (decodedToken) {
            if (decodedToken.iat)
                delete decodedToken.iat;

            return database()
                .repository('device')
                .findOneById(decodedToken.device)
                .then(device => {
                    if (!device)
                        return Promise.reject("Device not found for this token");
                    else if (device.refresh_token != refreshToken)
                        return Promise.reject("Invalid refresh token");

                    return generateJsonWebToken(decodedToken, device);
                });
        } else
            return Promise.reject("Invalid token");
    }
}

function generateJsonWebToken (jwtContent, device) {
    let jwtKey = process.env.JWT_SECRET || 'OFcKgPZjWyLPlpXe80WMR6qRGJKG7RLD',
    
        refreshToken = generateRefreshToken(jwtContent.identity),
        
        deviceId = database().getId(device);

    jwtContent.device = deviceId;

    return database()
        .repository('device')
        .update(deviceId, {
            "refresh_token" : refreshToken,
            "disabled" : false
        })
        .then(device => {
            console.log("Token generated");

            return {
                "refresh_token" : refreshToken,
                'token_type' : tokenType,
                "access_token" : jwt.sign(jwtContent, jwtKey),
                "expires_in" : jwtContent["expire"] || 0
            };
        });
}

function generateRefreshToken (identity) {
    return crypto.createHash('md5').update(identity + "_" + new Date().getTime()).digest("hex");
}