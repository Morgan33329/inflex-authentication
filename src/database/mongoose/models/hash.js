import mongoose from "mongoose";

/*
1: Lost password
2: Activate
*/

const hashSchema = mongoose.Schema({
    identity_id : mongoose.Schema.ObjectId,

    account_id :  mongoose.Schema.ObjectId,

    hash : String,

    type : Number,

    created_at : Date
});

hashSchema.pre('save', function(next) {
    let now = new Date();
    
    if ( !this.created_at )
        this.created_at = now;

    next();
});

export default mongoose.model('auth_hash', hashSchema);