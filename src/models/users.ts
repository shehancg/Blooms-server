import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address:{
        type: String,
        required: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
});

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true,
});

export const userModel = mongoose.model<any, any>("User", userSchema);
// export const userModel = userSchema;
