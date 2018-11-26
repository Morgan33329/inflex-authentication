import {
    getConfig
} from './config';

var library = null;

/**
 * Get the database driver by database.tpye in config
 */
export default function () {
    let databaseName = getConfig('database.library');

    if (!databaseName) {
        console.error('Database type not set!');
        process.exit();
    }

    switch (databaseName) {
        case 'mongoose':
            if (!library) library = require('./database/mongoose').default;
            break;
        case 'typeorm':
            if (!library) library = require('./database/typeorm').default;
            break;
        default:
            console.error('Invalid database type!');
            process.exit();
    }

    return library();
}