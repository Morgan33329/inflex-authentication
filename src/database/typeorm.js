var ormClass;

import { createConnection } from "typeorm";

import Account from './typeorm/models/account';
import Device from './typeorm/models/device';
import Identity from './typeorm/models/identity';
import Password from './typeorm/models/password';
import Hash from './typeorm/models/hash';
import Social from './typeorm/models/social';

import AccountRepository from './typeorm/repositories/account';
import DeviceRepository from './typeorm/repositories/device';
import IdentityRepository from './typeorm/repositories/identity';
import PasswordRepository from './typeorm/repositories/password';
import SocialRepository from './typeorm/repositories/social';

/**
 * Example config:
 * 
 * database : {
 *    library : "typeorm",
 *
 *    username : 'root',
 *    password : 'ubuntu',
 *    database : 'mydatabase',
 *    type : 'mysql',
 *
 *    synchronize : true,
 *    logging : true
 *}
 */

class TypeORM {
    getType () {
        return 'typeorm';
    }

    getId (object) {
        return object.id;
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
            default:
                console.error("Repository " + type + " not found");
                process.exit();
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
                console.error("Model type " + model + " not found");
                process.exit();
        }
    }

    setData (model, data, array) {
        for (let column in array) {
            let defaultValue = array[column];

            if (typeof data[column] !== 'undefined')
                model[column] = data[column]
            else if (typeof model[column] === 'undefined')
                model[column] = defaultValue;
        }
    }
}

export default function () {
    if (!ormClass)
        ormClass = new TypeORM();

    return ormClass;
}