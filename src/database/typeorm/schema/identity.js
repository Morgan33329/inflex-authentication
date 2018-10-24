import { EntitySchema } from 'typeorm';

import Identity from '../models/identity';

module.exports = new EntitySchema({
    tableName : 'auth_identity',
    name : 'Identity',
    target : Identity,
    columns : {
        id : {
            primary : true,
            type : 'int',
            generated : true
        },
        activated : {
            type : 'smallint',
            default : 1
        },
        enabled : {
            type : 'smallint',
            default : 1
        },
        blocked : {
            type : 'smallint',
            default : 1
        },
        blocked_at : {
            type : 'timestamp',
            nullable : true
        },
        created_at : {
            type : 'timestamp',
            nullable : true
        },
        updated_at : {
            type : 'timestamp',
            nullable : true
        },
        deleted_at : {
            type : 'timestamp',
            nullable : true
        }
    }
});