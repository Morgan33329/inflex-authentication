import moment from 'moment';

export default class Hash {
    constructor(
        id, 
        identity, 
        account, 
        hash, 
        type, 
        createdAt = null
        ) {
        this.id = id;
        this.identity_id = identity;
        this.account_id = account;
        this.hash = hash;
        this.type = type;

        if (!createdAt) {
            let now = moment().format('YYYY-MM-DD HH:mm:ss');
    
            this.created_at = now;
        } else {
            this.created_at = createdAt;
        }
    }
}