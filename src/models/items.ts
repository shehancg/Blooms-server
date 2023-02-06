import mongoose from 'mongoose';

export const itemsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        default: 0
    },
    countInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 200
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
})

itemsSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

itemsSchema.set('toJSON', {
    virtuals: true,
})

export const itemModel = mongoose.model<any, any>("Item", itemsSchema);