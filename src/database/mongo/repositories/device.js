var deviceRepository;

import Promise from 'bluebird';

import Device from './../models/device';

class DeviceRepository {
    insert (data) {
        return new Promise((resolve) => {
            return Device.create(data, (err, result) => {
                resolve(result);
            });
        });
    }

    update (id, data) {
        let self = this;

        return new Promise((resolve) => {
            Device
                .updateOne({ 
                    '_id' : id 
                }, data, () => {
                    self.findOneById(id)
                        .then(device => {
                            resolve(device);
                        });
                });
        });
    }

    findOneById (id) {    
        return new Promise((resolve) => {
            Device
                .findById(id)
                .exec((err, result) => {
                    resolve(result);
                });
            });
    }

    findOneByDeviceId (deviceId) {
        return new Promise((resolve) => {
            Device
                .findOne({ 
                    'device_id' : deviceId
                })
                .exec((err, result) => {
                    resolve(result);
                });
            });
    }

    disableAllExceptThis (device) {
        return new Promise((resolve) => {
            Device
                .updateMany({
                    "$and": [
                        { '_id' : { "$ne": database().getId(device) } },
                        { 'identity_id' : device.identity_id }
                    ]
                }, {
                    'disabled' : true,
                    'refresh_token' : ''
                }, () => {
                    resolve();
                });
        });
    }

    disableAll (identity) {
        return new Promise((resolve) => {
            Device
                .updateMany(
                    { 'identity_id' : identity }
                , {
                    'disabled' : true,
                    'refresh_token' : ''
                }, () => {
                    resolve();
                });
        });
    }

    findOneByDeviceIdAndIdentity (deviceId, identityId) {
        return new Promise((resolve) => {
            Device
                .findOne({ 
                    'device_id' : deviceId,
                    'identity_id' : identityId
                })
                .exec((err, result) => {
                    resolve(result);
                });
            });
    }
}


export default function () {
    if (!deviceRepository)
        deviceRepository = new DeviceRepository();

    return deviceRepository;
}