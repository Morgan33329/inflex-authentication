import { getManager } from 'typeorm';

import Social from './../models/social';

var socialRepository;

class SocialRepository {
    findOneById (id) {    
        return getManager()
            .getRepository(Social)
            .createQueryBuilder('social')
            .where("social.id = :id", { id: id })
            .getOne();
    }
}


export default function () {
    if (!socialRepository)
        socialRepository = new SocialRepository();

    return socialRepository;
}
