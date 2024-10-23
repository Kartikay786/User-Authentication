import express from 'express'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from './models/User.model.js'
import auth from './Middleware/Auth.middleware.js'

const app = express();

app.use(express.json());

// db connection

mongoose.connect('mongodb://localhost:27017/userLogin',{
    useNewUrlParser : true,
    useUnifiedTopology : true
})
.then(()=>{
    console.log('Db Connected');
})
.catch((err)=>{
    console.log(err);
});

// token generate 
const gentoken =  (userId) =>{
  return  jwt.sign({id : userId},'evolving_secrect_code',{expiresIn : '1h'});
}

// Registration route
app.post('/api/auth/registration', async (req,res)=>{
    const {name, email, password} = req.body ;

    try{
         // check user is already registered or not
        const existingUser = await User.findOne({email});
        if(existingUser){
            console.log('User is already registered');
            res.status(400).json('USer is already registered . plz login');
        }
    
        // create user
        const newUser = new User({name,email,password});
        await newUser.save();
      

        // generate token
        const token = gentoken(newUser._id);
        return  res.status(200).json({message :'User is registered Successfully ' , token,newUser}); 
    }
    catch(err){
        console.log(err);
       return res.status(500).json({message:'Error ',err});
      
    }
   
    
})

//Login Route 
app.post('/api/auth/login', async (req,res)=>{
    const {email, password} = req.body;

    try{
         // check email is valid 
    const user = await User.findOne({email});
    if(!user){
      return  res.status(400).json('Invalid email ');
    }

    // verify password
    const isMatch = await user.comparePassword(password);
    if(!isMatch){
      return  res.status(400).json('Invalid  password');
    }

    const token = gentoken(user._id);
    return res.status(200).json({message : 'login succesful'},token,user);
    }
    catch(err){
        console.log(err);
        return res.status(500).json('Server error ');
    }
})

// protected route 

app.get('/api/protected',auth,(req,res,next)=>{
    res.status(200).json({message:'hello protected route', user:req.user})
})


app.listen(3000,()=>{
    console.log("server start");
})