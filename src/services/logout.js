import database from './../database';

export default class {
    user (user) {
        this.userObject = user;
    }

    logout (user) {
        var self = this;

        console.log("Logout success");

        database()
            .repository('device')
            .disableAll(database().getId(self.userObject.user));
    }
}