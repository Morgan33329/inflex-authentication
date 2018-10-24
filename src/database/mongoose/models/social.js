import mongoose from "mongoose";

const socialSchema = mongoose.Schema({
    identity_id : mongoose.Schema.ObjectId,

    social_type :  Number,
    
    social_id : String,

    created_at : Date
});

socialSchema.pre('save', function(next) {
    let now = new Date();
    
    if ( !this.created_at )
        this.created_at = now;

    next();
});

export default mongoose.model('auth_social', socialSchema);