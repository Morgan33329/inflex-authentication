import mongoose from "mongoose";

const accountSchema = mongoose.Schema({
    identity_id : mongoose.Schema.ObjectId,

    account :  String,

    type : Number,

    created_at : Date
});

accountSchema.pre('save', function(next) {
    let now = new Date();
    
    if ( !this.created_at )
        this.created_at = now;

    next();
});

export default mongoose.model('auth_account', accountSchema);