var passwordRepository;

import Promise from 'bluebird';
import Password from './../models/password';

class PasswordRepository {
    findOneById (id) {    
        return new Promise((resolve) => {
            Password
                .findById(id)
                .exec((err, result) => {
                    resolve(result);
                });
        });
    }

    findByPassword (password) {
        return new Promise((resolve) => {
            Password
                .find({ 
                    'password' : password
                })
                .exec((err, results) => {
                    resolve(results);
                });
        });
    }

    findAllByIdentity (identityId) {
        return new Promise((resolve) => {
            Password
                .find({ 
                    'identity_id' : identityId
                })
                .exec((err, results) => {
                    resolve(results);
                });
        });
    }
}


export default function () {
    if (!passwordRepository)
        passwordRepository = new PasswordRepository();

    return passwordRepository;
}