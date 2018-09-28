import mongoose from "mongoose";

const passwordSchema = mongoose.Schema({
    identity_id : mongoose.Schema.ObjectId,

    password :  String,

    expired_at : Date,

    created_at : Date
});

passwordSchema.pre('save', function(next) {
    let now = new Date();
    
    if ( !this.created_at )
        this.created_at = now;

    next();
});

export default mongoose.model('user_password', passwordSchema);