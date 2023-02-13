import express, {Router} from 'express';
import asyncHandler from 'express-async-handler';
// import { HTTP_BAD_REQUEST } from '../constants/http_status';
import { OrderStatus } from '../shared/orderStatus';
import { OrderModel } from '../models/orders'
import { itemModel } from '../models/items';
import { verify } from '../shared/security'
import auth from '../shared/auth.mid'
// import auth from '../middlewares/auth.mid';

const router = express.Router();
//router.use(verify);
//router.use(auth);


router.get(`/`, async (req, res) =>{
    const allorders = await OrderModel.find()
    
    if(!allorders){
        res.status(500).json({success:false})
    }
    res.send(allorders);
})

router.post('/create',
asyncHandler(async (req:any, res:any) => {
    const requestOrder = req.body;
    // console.log(req.)
    try{
        if(requestOrder.items.length <= 0){
            res.status(400).send('Cart Is Empty!');
            return;
        }

        await OrderModel.deleteOne({
            user: req.body.user,
            status: OrderStatus.NEW
        });

        const newOrder = new OrderModel({...requestOrder,user: req.body.user});
        await newOrder.save();
        res.send(newOrder);
    }
    catch(err:any){
        console.log(err.message)
    }
    })
)


router.get('/newOrderForCurrentUser', asyncHandler( async (req:any,res ) => {
    const order= await getNewOrderForCurrentUser(req);
    if(order) res.send(order);
    else res.status(400).send();
}))

router.post('/pay', asyncHandler( async (req:any, res) => {
    const {paymentId} = req.body;
    const order = await getNewOrderForCurrentUser(req);
    if(!order){
        res.status(400).send('Order Not Found!');
        return;
    }

    order.paymentId = paymentId;
    order.status = OrderStatus.PAYED;
    await order.save();

    res.send(order._id);
}))

router.get('/track/:id', asyncHandler( async (req, res) => {
    const order = await OrderModel.findById(req.params.id);
    res.send(order);
}))

export default router;

async function getNewOrderForCurrentUser(req: any) {
    return await OrderModel.findOne({ user: req.user.id, status: OrderStatus.NEW });
}
