var socialRepository;

import Promise from 'bluebird';
import Social from './../models/social';

class SocialRepository {
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
    if (!socialRepository)
        socialRepository = new SocialRepository();

    return socialRepository;
}
