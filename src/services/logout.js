import database from './../database';
import { getConfig } from './../config';

export default class {
    user (user) {
        this.userObject = user;

        this.log = getConfig('log');
    }

    logout (user) {
        var self = this;

        self.log("Logout success");

        database()
            .repository('device')
            .disableAll(database().getId(self.userObject.user));
    }
}