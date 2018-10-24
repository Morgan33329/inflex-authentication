import { EntitySchema } from 'typeorm';

import Device from '../models/device';

module.exports = new EntitySchema({
    tableName : 'auth_device',
    name : 'Device',
    target : Device,
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
        refresh_token : {
            type : 'varchar',
            nullable : true
        },
        device_id : {
            type : 'varchar',
            nullable : true
        },
        device_type : {
            type : 'smallint',
            nullable : true
        },
        device_push : {
            type : 'varchar',
            nullable : true
        },
        device_language : {
            type : 'varchar',
            length: 4,
            nullable : true
        },
        is_guest : {
            type : 'smallint',
            default : 0
        },
        disabled : {
            type : 'smallint',
            default : 0
        },
        created_at : {
            type : 'timestamp',
            nullable : true
        }
    }
});