import { getManager } from 'typeorm';

import Device from './../models/device';
import database from './../../../database';

var deviceRepository;

class DeviceRepository {
    insert (data) {
        return getManager()
            .createQueryBuilder()
            .insert()
            .into(Device)
            .values([ data ])
            .execute();
    }

    update (id, data) {
        let self = this;

        return getManager()
            .createQueryBuilder()
            .update(Device)
            .set(data)
            .where('id = :id', { id: id })
            .execute()
            .then(() => {
                return self.findOneById(id);
            });
    }

    findOneById (id) {    
        return getManager()
            .getRepository(Device)
            .createQueryBuilder('device')
            .where('device.id = :id', { id : id })
            .getOne();
    }

    findOneByDeviceId (deviceId) {
        return getManager()
            .getRepository(Device)
            .createQueryBuilder('device')
            .where('device.device_id = :id', { id : deviceId })
            .getOne();
    }

    disableAllExceptThis (device) {
        return getManager()
            .createQueryBuilder()
            .update(Device)
            .set({
                'disabled' : true,
                'refresh_token' : ''
            })
            .where('id != :id', { id: database().getId(device) })
            .andWhere('identity_id = :identity', { identity : device.identity_id })
            .execute();
    }

    disableAll (identity) {
        return getManager()
            .createQueryBuilder()
            .update(Device)
            .set({
                'disabled' : true,
                'refresh_token' : ''
            })
            .where('identity_id = :identity', { identity : identity })
            .execute();
    }

    findOneByDeviceIdAndIdentity (deviceId, identityId) {
        return getManager()
            .getRepository(Device)
            .createQueryBuilder('device')
            .where('device.device_id = :id', { id : deviceId })
            .andWhere('device.identity_id = :identity', { identity : identityId })
            .getOne();
    }
}


export default function () {
    if (!deviceRepository)
        deviceRepository = new DeviceRepository();

    return deviceRepository;
}