import { itemModel } from '../models/items';
import express, { Router } from 'express';
import mongoose from 'mongoose';
import { verify } from '../shared/security';
import multer from 'multer';

const FILE_TYPE_MAP: { [key: string]: string } = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError: Error | null = null;

        if (!isValid) {
            uploadError = new Error('invalid image type');
        }
        cb(uploadError, 'public/uploads');
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    },
});

const uploadOptions = multer({ storage });

const router: Router = express.Router();

export default router;
export { uploadOptions };

router.get(`/`, async (req, res) =>{
    const allitems = await itemModel.find()
    
    if(!allitems){
        res.status(500).json({success:false})
    }
    res.send(allitems);
})

router.get(`/:id`, async (req, res) =>{
    const items = await itemModel.findById(req.params.id)
    
    if(!items){
        res.status(500).json({success:false})
    }
    res.send(items);
})

router.post(`/itemsadd`, uploadOptions.single('image'), async (req, res) =>{
    const file = req.file;
    // if(!file) return res.status(400).send('No image in the request')
    if (!req.file) {
        res.status(400).json({ success: false, message: 'No image file was provided' });
        return;
    }
    
    const fileName = req.file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    let product = new itemModel({
        name: req.body.name,
        description: req.body.description,
        image: `${basePath}${fileName}`,
        price: req.body.price,
        countInStock: req.body.countInStock,
    })

    product = await product.save();
    
    if(!product)
    return res.status(500).send('The product cannot create')

    res.send(product);
})

router.delete('/:id', (req, res)=>{
    itemModel.findByIdAndRemove(req.params.id).then((item: any) =>{
        if(item) {
            return res.status(200).json({success: true, message: 'the product is deleted! '})
        }else{
            return res.status(404).json({success: false, message: "product not found!" })
        }
    }).catch((err: any)=>{
       return res.status(500).json({success: false, error: err}) 
    })
})

router.get(`/get/count`, async (req, res) =>{
    const itemCount = await itemModel.count();
    //const productCount = await Product.countDocuments();
    
    if(!itemCount){
        res.status(500).json({success:false})
    }
    res.send({
        productCount: itemCount
    });
})