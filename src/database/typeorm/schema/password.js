import { EntitySchema } from 'typeorm';

import Password from '../models/password';

module.exports = new EntitySchema({
    tableName : 'auth_password',
    name : 'Password',
    target : Password,
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
        password : {
            type : 'varchar',
            length : 255
        },
        expired_at : {
            type : 'timestamp',
            nullable : true
        },
        created_at : {
            type : 'timestamp',
            nullable : true
        }
    }
});