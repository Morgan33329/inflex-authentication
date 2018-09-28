var mongoClass;

import mongoose from 'mongoose';

import AccountRepository from './mongo/repositories/account';
import DeviceRepository from './mongo/repositories/device';
import IdentityRepository from './mongo/repositories/identity';
import PasswordRepository from './mongo/repositories/password';
import SocialRepository from './mongo/repositories/social';

import Account from './mongo/models/account';
import Device from './mongo/models/device';
import Identity from './mongo/models/identity';
import Hash from './mongo/models/hash';
import Password from './mongo/models/password';
import Social from './mongo/models/social';

class Mongo {
    checkConfig (cnf) {
        if (!cnf.host) {
            console.log('Missing host from mongodb database config database');
            process.exit();
        }

        this.connect(cnf.host)
    }

    getType () {
        return 'mongo';
    }

    getId (object) {
        return object._id;
    }

    connect(host) {
        mongoose.connect(host);
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
            case 'social':
                return Social;
            default:
                console.log("Model type " + model + " not found");
        }
    }
}

export default function () {
    if (!mongoClass)
        mongoClass = new Mongo();

    return mongoClass;
}