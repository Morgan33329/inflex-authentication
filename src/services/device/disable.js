import database from './../../database';

export default class {
    device = function(device) {
        this.deviceData = device;
    }

    exceptMe = function() {
        console.log("All devices disabled");

        database()
            .repository('device')
            .disableAllExceptThis(this.deviceData);
    }
}