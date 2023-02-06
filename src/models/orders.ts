import mongoose, {model, Schema, Types} from 'mongoose';
import { OrderStatus } from '../shared/orderStatus';
import { itemsSchema } from './items'
import exp from 'constants';

// export interface LatLng{
//     lat: string;
//     lng: string;
// }

export const LatLngSchema = new mongoose.Schema(
    {
        lat: {
            type: String, required: true
        },
        lng: {
            type: String, required: true
        },
    }
);

// export interface OrderItem{
//     item: Food;
//     price: number;
//     quantity: number;
// }

export const OrderItemSchema = new mongoose.Schema({
        item:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item'
        },
        price:{ 
            type: Number,
            required:true
        },
        quantity: {
            type: Number, 
            required: true
        }
});

// export interface Order{
//     id:string;
//     items: OrderItem[];
//     totalPrice:number;
//     name: string;
//     address: string;
//     addressLatLng:LatLng
//     paymentId: string;
//     status: OrderStatus;
//     user: Types.ObjectId;
//     createdAt: Date;
//     updatedAt: Date
//   }

export const orderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String, 
        required: true
    },
    addressLatLng: {
        type: LatLngSchema,
        required: true
    },
    paymentId: {
        type: String
    },
    totalPrice: {
        type: Number,
        required: true
    },
    items: {
        type: [OrderItemSchema], 
        required: true
    },
    status: {
        type: String, 
        default: OrderStatus.NEW
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }
    },{
        timestamps: true,
        toJSON:{
            virtuals: true
        },
        toObject:{
            virtuals: true
        }
    });

  export const OrderModel = mongoose.model<any, any>('order', orderSchema);