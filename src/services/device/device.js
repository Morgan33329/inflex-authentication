import database from './../../database';
import { getConfig } from './../../config';

export default class {
    constructor () {
        this.log = getConfig('log');
    }

    user (user) {
        this.userObject = user;

        return this;
    }

    device (device) {
        this.device = device;

        return this;
    }

    create (options) { 
        options = options || {};

        let self = this, 

            id = options.id || 'web';

        return database()
            .repository('device')
            .findOneByDeviceIdAndIdentity(id, database().getId(this.userObject.user))
            .then(device => {
                if (!device) {
                    self.log('Device not found: ' + id);

                    return database()
                        .repository('device')
                        .insert({
                            'identity_id' : database().getId(self.userObject.user),
                            'device_id'  : id
                        })
                        .then(savedDevice => {
                            self.log('Device uploaded');

                            return savedDevice;
                        })
                        .catch(err => {
                            throw err;
                        });
                } else {
                    self.log('Device found: ' + id);

                    return device;
                }
            })
            .then(device => {
                self.device = device

                return self.update(options);
            })
            .catch(err => {
                throw err;
            });
    }

    update (options) {
        var self = this,
        
            update   = {},
            deviceId = database().getId(this.device);

        if (options.type) {
            if (options.type == 1 || options.type == 'ios')
                update.device_type = 1;
            else if (options.type == 2 || options.type == 'android')
                update.device_type = 1;
        }

        if (options.push)
            update.device_push = options['push'];

        if (options.language)
            update.device_language = options['language'];

        return database()
            .repository('device')
            .update(deviceId, update)
            .then(device => {
                self.log('Device updated: ' + JSON.stringify(options));

                return device;
            });
    }
}