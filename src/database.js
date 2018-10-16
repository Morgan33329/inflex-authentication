import mongo from './database/mongo';

import {
    getConfig
} from './config';

/**
 * Get the database driver by database.tpye in config
 */
export default function () {
    let databaseName = getConfig('database.type');

    if (!databaseName) {
        console.error('Database type not set!');
        process.exit();
    }
    
    switch (databaseName) {
        case 'mongo':
            return mongo();
            break;
    }
}