import moment from 'moment';

export default class Device {
    constructor(
        id, 
        identity, 
        refresh = '', 
        deviceId = 'unknown', 
        deviceType = 0,
        devicePush = null, 
        deviceLanguage = null, 
        isGuest = false, 
        disabled = false, 
        createdAt = null
        ) {

        this.id = id;
        this.identity_id = identity;
        this.refresh_token = refresh;
        this.device_id = deviceId;
        this.device_type = deviceType;
        this.device_push = devicePush;
        this.device_language = deviceLanguage;
        this.is_guest = isGuest;
        this.disabled = disabled;

        if (!createdAt) {
            let now = moment().format('YYYY-MM-DD HH:mm:ss');
    
            this.created_at = now;
        } else {
            this.created_at = createdAt;
        }
    }
}