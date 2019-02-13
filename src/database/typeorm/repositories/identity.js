import { getManager } from 'typeorm';

import Identity from './../models/identity';

var identityRepository;

class IdentityRepository {
    findOneById (id) {    
        if (!id)
            return;

        return getManager()
            .createQueryBuilder()
            .select("identity")
            .from(Identity, "identity")
            .where("identity.id = :id", { id: id })
            .getOne();
    }
}


export default function () {
    if (!identityRepository)
        identityRepository = new IdentityRepository();

    return identityRepository;
}