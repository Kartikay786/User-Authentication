import jwt from 'jsonwebtoken'
import User from '../models/User.model.js'

const auth = async (req,res,next)=>{
    const token = req.header('Authorization')?.replace('Bearer','');
    if(!token){
        return res.status(400).json({message:'Token not found'});
    }

    try{
        const decoded = jwt.verify(token,'evolving_secrect_code');
        req.User = await User.findByID(decoded.id).select('-password');
        next();
    }
    catch(err){
        return res.status(401).json({message:'Invalid token'});
    }
};

export default auth 