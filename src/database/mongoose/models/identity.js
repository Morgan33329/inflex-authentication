import mongoose from "mongoose";

const identitySchema = mongoose.Schema({
    activated: { 
        type: Boolean, 
        default: true 
    },

    enabled:  { 
        type: Boolean, 
        default: true 
    },

    blocked: Boolean,

    blocked_at: Date,

    created_at: Date,

    deleted_at: Date,

    updated_at: Date
});

identitySchema.pre('save', function(next) {
    let now = new Date();

    this.updated_at = now;

    if ( !this.created_at ) {
        this.created_at = now;
    }

    next();
});

export default mongoose.model('auth_identity', identitySchema);