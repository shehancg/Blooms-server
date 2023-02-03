import { userModel } from '../models/users'
import express from 'express';
const router = express.Router();
import bcrypt from 'bcryptjs';
import { generateToken } from '../shared/security';

router.post('/register', async (req,res)=>{
    let user = new userModel({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 11),
        phone: req.body.phone,
        address: req.body.address,
        isAdmin: req.body.isAdmin,
    })
    user = await user.save();

    if(!user)
    return res.status(400).send('the user cannot be created!')

    res.send(user);
})

export default router;
