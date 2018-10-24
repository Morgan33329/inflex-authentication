import mongoose from './database/mongoose';
import typeorm from './database/typeorm';

import {
    getConfig
} from './config';

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
            return mongoose();
            break;
        case 'typeorm':
            return typeorm();
            break;
        default:
            console.error('Invalid database type!');
            process.exit();
    }
}