import mongoose from "mongoose";

const deviceSchema = mongoose.Schema({
    identity_id : mongoose.Schema.ObjectId,

    refresh_token :  String,

    device_id : String,

    device_type : Number,

    device_push : String,

    device_language : String,

    is_guest : Boolean,

    disabled : Boolean,

    created_at : Date
});

deviceSchema.pre('save', function(next) {
    let now = new Date();
    
    if ( !this.created_at )
        this.created_at = now;

    next();
});

export default mongoose.model('user_device', deviceSchema);