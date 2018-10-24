import moment from 'moment';

export default class Account {
    constructor(
        id, 
        identity, 
        account, 
        type, 
        createdAt = null
        ) {
        this.id = id;
        this.identity_id = identity;
        this.account = account;
        this.type = type;

        if (!createdAt) {
            let now = moment().format('YYYY-MM-DD HH:mm:ss');
    
            this.created_at = now;
        } else {
            this.created_at = createdAt;
        }
    }
}