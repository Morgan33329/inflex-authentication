var accountRepository;

import Promise from 'bluebird';
import Account from './../models/account';

class AccountRepository {
    findOneById (id) {    
        return new Promise((resolve) => {
            Account
                .findById(id)
                .exec((err, result) => {
                    resolve(result);
                });
            });
    }

    findByAccount (account) {
        return new Promise((resolve) => {
            Account
                .findOne({ 
                    'account' : account
                })
                .exec((err, results) => {
                    resolve(results);
                });
            });
    }
}

export default function () {
    if (!accountRepository)
        accountRepository = new AccountRepository();

    return accountRepository;
}