import { getManager } from 'typeorm';

import Account from './../models/account';

var accountRepository;

class AccountRepository {
    findOneById (id) {    
        if (!id)
            return;

        return getManager()
            .getRepository(Account)
            .createQueryBuilder('account')
            .where('account.id = :id', { id : id })
            .getOne();
    }

    findByAccount (account) { 
        if (!account)
            return;

        return getManager()
            .getRepository(Account)
            .createQueryBuilder('account')
            .where('account.account = :account', { account : account })
            .getOne()
            .then(many => {
                return many;
            });
    }
}

export default function () {
    if (!accountRepository)
        accountRepository = new AccountRepository();

    return accountRepository;
}