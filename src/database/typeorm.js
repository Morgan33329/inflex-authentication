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
    checkConfig (cnf) {
        if (!cnf.username || !cnf.password || !cnf.database) {
            console.error('Missing data from mongodb database config database');
            process.exit();
        }
    }

    getType () {
        return 'typeorm';
    }

    getId (object) {
        return object.id;
    }

    connect (cnf) {
        let entities = cnf.entities || [];

        entities.push(require('./typeorm/schema/account'));
        entities.push(require('./typeorm/schema/account'));
        entities.push(require('./typeorm/schema/device'));
        entities.push(require('./typeorm/schema/identity'));
        entities.push(require('./typeorm/schema/password'));
        entities.push(require('./typeorm/schema/hash'));
        entities.push(require('./typeorm/schema/social'));

        createConnection({
            type : cnf.type || 'mysql',

            host : cnf.host || 'localhost',
            port : cnf.port || 3306,
            username : cnf.username,
            password : cnf.password,
            database : cnf.database,

            entitySchemas : entities,
            entities : entities,

            synchronize : cnf.synchronize || false,
            logging : cnf.logging || false
        }).then(connection => {
            //console.log("TypeORM database connection success");
        }).catch(error => console.error(error));
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
            default:
                console.error("Repository " + model + " not found");
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