import { getManager } from 'typeorm';

import Password from './../models/password';

var passwordRepository;

class PasswordRepository {
    findOneById (id) {    
        if (!id)
            return;

        return getManager()
            .getRepository(Password)
            .createQueryBuilder('password')
            .where("password.id = :id", { id: id })
            .getOne();
    }

    findByPassword (password) { 
        if (!password)
            return;

        return getManager()
            .getRepository(Password)
            .createQueryBuilder('password')
            .where("password.password = :password", { password : password })
            .getMany();
    }

    findAllByIdentity (identityId) {
        if (!identityId)
            return;

        return getManager()
            .getRepository(Password)
            .createQueryBuilder('password')
            .where("password.identity_id = :identity", { identity : identityId })
            .getMany();
    }
}


export default function () {
    if (!passwordRepository)
        passwordRepository = new PasswordRepository();

    return passwordRepository;
}