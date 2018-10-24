var identityRepository;

import Promise from 'bluebird';
import Identity from './../models/identity';

class IdentityRepository {
    findOneById (id) {    
        return new Promise((resolve) => {
            Identity
                .findById(id)
                .exec((err, result) => {
                    resolve(result);
                });
            });
    }
}


export default function () {
    if (!identityRepository)
        identityRepository = new IdentityRepository();

    return identityRepository;
}