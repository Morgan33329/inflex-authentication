import { getManager } from 'typeorm';

import Password from './../models/password';

var passwordRepository;

class PasswordRepository {
    findOneById (id) {    
        return getManager()
            .getRepository(Password)
            .createQueryBuilder('password')
            .where("password.id = :id", { id: id })
            .getOne();
    }

    findByPassword (password) {
        return getManager()
            .getRepository(Password)
            .createQueryBuilder('password')
            .where("password.password = :password", { password : password })
            .getMany();
    }

    findAllByIdentity (identityId) {
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