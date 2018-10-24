import { EntitySchema } from 'typeorm';

import Hash from '../models/hash';

module.exports = new EntitySchema({
    tableName : 'auth_hash',
    name : 'Hash',
    target : Hash,
    columns : {
        id : {
            primary : true,
            type : 'int',
            generated : true
        },
        identity_id : {
            type : 'int',
            unsigned : true
        },
        account_id : {
            type : 'int',
            unsigned : true,
            nullable : true
        },
        hash : {
            type : 'varchar'
        },
        type : {
            type : 'smallint'
        },
        created_at : {
            type : 'timestamp',
            nullable : true
        }
    }
});