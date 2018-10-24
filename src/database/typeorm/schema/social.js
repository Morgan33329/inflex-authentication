import { EntitySchema } from 'typeorm';

import Social from '../models/social';

module.exports = new EntitySchema({
    tableName : 'auth_social',
    name : 'Password',
    target : Social,
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
        social_type : {
            type : 'smallint'
        },
        social_id : {
            type : 'varchar',
            length : 255
        },
        created_at : {
            type : 'timestamp',
            nullable : true
        }
    }
});