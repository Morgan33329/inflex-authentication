import database from './../database';

export function createObject (user) {
    let getIdentity = new Promise((resolve) => {
        if (!user.identity)
            return resolve(null);

        database()
            .repository('identity')
            .findOneById(user.identity)
            .then(identity => {
                resolve(identity);
            });
    });

    let getPassword = new Promise((resolve) => {
        if (!user.password)
            return resolve(null);

        database()
            .repository('password')
            .findOneById(user.password)
            .then(password => {
                resolve(password);
            });
    });

    let getAccount = new Promise((resolve) => {
        if (!user.account)
            return resolve(null);

        database()
            .repository('account')
            .findOneById(user.account)
            .then(account => {
                resolve(account);
            });
    });

    let getDevice = new Promise((resolve) => {
        if (!user.device)
            return resolve(null);

        database()
            .repository('device')
            .findOneById(user.device)
            .then(device => {
                resolve(device);
            });
    });

    let getSocial = new Promise((resolve) => {
        if (!user.social)
            return resolve(null);

        database()
            .repository('social')
            .findOneById(user.social)
            .then(social => {
                resolve(social);
            });
    });

    return Promise
        .all([
            getIdentity,
            getPassword,
            getAccount,
            getDevice,
            getSocial
        ])
        .then(values => {
            let identity = values[0],
                password = values[1],
                account  = values[2],
                device   = values[3],
                social   = values[4],
                
                response = {};

            response['user'] = identity;
            response['password'] = password;
            response['account'] = account;
            response['device'] = device;
            response['social'] = social;

            return response;
        })
        .catch((err) => {
            throw err;
        });
}

export function getAuthKeys (user) {
    var response = {
        identity : database().getId(user.user)
    };

    if (user.password)
        response['password'] = database().getId(user.password);

    if (user.account)
        response['account'] = database().getId(user.account);

    if (user.device)
        response['device'] = database().getId(user.device);

    if (user.social)
        response['social'] = database().getId(user.social);

    return response;
}