import moment from 'moment';

export default class Password {
    constructor(
        id, 
        identity, 
        password, 
        expiredAt = null, 
        createdAt = null
        ) {
        this.id = id;
        this.identity_id = identity;
        this.password = password;
        this.expired_at = expiredAt;

        if (!createdAt) {
            let now = moment().format('YYYY-MM-DD HH:mm:ss');
    
            this.created_at = now;
        } else {
            this.created_at = createdAt;
        }
    }
}