import { EntitySchema } from 'typeorm';

import Account from '../models/account';

module.exports = new EntitySchema({
    tableName : 'auth_account',
    name : 'Account',
    target : Account,
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
        account : {
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
})