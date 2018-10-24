import moment from 'moment';

export default class Social {
    constructor(
        id, 
        identity, 
        socialType, 
        socialId, 
        createdAt = null
        ) {
        this.id = id;
        this.identity_id = identity;
        this.social_type = socialType;
        this.social_id   = socialId;

        if (!createdAt) {
            let now = moment().format('YYYY-MM-DD HH:mm:ss');
    
            this.created_at = now;
        } else {
            this.created_at = createdAt;
        }
    }
}