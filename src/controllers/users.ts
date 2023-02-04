import { userModel } from '../models/users'
import express from 'express';
const router = express.Router();
import bcrypt from 'bcryptjs';
import { generateToken } from '../shared/security';

//REGISTER FUNCTION
router.post('/register', async (req,res)=>{
    //check if a user with the same email already exists
    const existingEmail = await userModel.findOne({email: req.body.email});
    if(existingEmail){
        return res.status(409).json({message: "Email already in use"});
    }

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
    return res.status(400).send('The user cannot be created!')

    res.send(user);
})

//LOGIN FUNCTION
router.post('/login', async(req,res) =>{
    const user = await userModel.findOne({email: req.body.email})
    const secret = process.env.secret;
 
    if(!user) {
        return res.status(400).send('Incorrect Email');
    }

    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        console.log("user found")
        // res.send(user);
        const token = generateToken({user: user.email, userRole: user.isAdmin})
        res.status(200).cookie("accessToken", token, {
            httpOnly: true,
            sameSite: 'none',
            path: "/api"
        }).json({
            message: {
                token: token,
                user: user
            }
        })
    } else{
        res.status(400).send('Incorrect Password');
    }
})

//GET USER BY ID
router.get('/:id', async(req,res)=>{
    const user = await userModel.findById(req.params.id).select('-passwordHash');

    if(!user){
        res.status(500).json({message: 'The user with ID doesnt Exist'})
    }
    res.status(200).send(user);
})

//GET ALL USERS
router.get(`/`, async (req, res) =>{
    const allUsers = await userModel.find().select('-passwordHash');
    
    if(!allUsers){
        res.status(500).json({success:false})
    }
    res.send(allUsers);
})

//GET USER COUNT
router.get(`/count`, async (req, res) =>{
    const userCount = await userModel.countDocuments()
    console.log(userCount)
    if(!userCount){
        res.status(500).json({success:false})
    }
    res.send({
        userCount: userCount
    });
})

export default router;
