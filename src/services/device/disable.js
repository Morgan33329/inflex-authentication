import database from './../../database';
import { getConfig } from './../../config';

export default class {
    constructor () {
        this.log = getConfig('log');
    }

    device (device) {
        this.deviceData = device;
    }

    exceptMe () {
        this.log("All devices disabled, except me...");

        database()
            .repository('device')
            .disableAllExceptThis(this.deviceData);
    }
}