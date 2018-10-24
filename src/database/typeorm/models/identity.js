import moment from 'moment';

import database from '../../typeorm';

export default class Identity {
    constructor(
        id, 
        activated, 
        enabled, 
        blocked, 
        blockedAt, 
        createdAt, 
        updatedAt, 
        deletedAt
    ) {
            
        this.id = id || 0;
        this.activated = activated;
        this.enabled   = enabled;
        this.blocked   = blocked;

        this.blocked_at = blockedAt;
        this.deleted_at = deletedAt;

        if (!createdAt) {
            let now = moment().format('YYYY-MM-DD HH:mm:ss');
    
            this.created_at = now;
            this.updated_at = now;
        } else {
            this.created_at = createdAt;
            this.updated_at = updatedAt;
        }
    }

    setData (data) {
        database()
            .setData(this, data, {
                activated : 1,
                enabled : 1,
                blocked : 0,
                blocked_at : null,
                deleted_at : null
            });
    }
}