var passwordRepository;

import Promise from 'bluebird';
import Social from './../models/social';

class PasswordRepository {
    findOneById (id) {    
        return new Promise((resolve) => {
            Social
                .findById(id)
                .exec((err, result) => {
                    resolve(result);
                });
        });
    }
}


export default function () {
    if (!passwordRepository)
        passwordRepository = new PasswordRepository();

    return passwordRepository;
}