var mongoClass;

import mongoose from 'mongoose';

import AccountRepository from './mongoose/repositories/account';
import DeviceRepository from './mongoose/repositories/device';
import IdentityRepository from './mongoose/repositories/identity';
import PasswordRepository from './mongoose/repositories/password';

import Account from './mongoose/models/account';
import Device from './mongoose/models/device';
import Identity from './mongoose/models/identity';
import Hash from './mongoose/models/hash';
import Password from './mongoose/models/password';
import Social from './mongoose/models/social';

/**
 * Example config:
 * 
 * database : {
 *     library : "mongoose",
 *
 *     host : 'mongodb://deckathlon:deckathlon@localhost:27017/deckathlon'
 * }
 */

class Mongoose {
    checkConfig (cnf) {
        if (!cnf.host) {
            console.error('Missing host from mongodb database config database');
            process.exit();
        }
    }

    getType () {
        return 'mongo';
    }

    getId (object) {
        return object._id;
    }

    connect(settings) {
        mongoose.connect(settings.host, { 
            useNewUrlParser: true 
        });
    }

    repository (type) {
        switch (type) {
            case 'account':
                return AccountRepository();
            case 'device':
                return DeviceRepository();
            case 'identity':
                return IdentityRepository();
            case 'password':
                return PasswordRepository();
            case 'social':
                return SocialRepository();
        }
    }

    model (model) {
        switch (model) {
            case 'account':
                return Account;
            case 'device':
                return Device;
            case 'identity':
                return Identity;
            case 'password':
                return Password;
            case 'hash':
                return Hash;
            default:
                console.error("Model type " + model + " not found");
        }
    }
}

export default function () {
    if (!mongoClass)
        mongoClass = new Mongoose();

    return mongoClass;
}