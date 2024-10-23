import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        unique : true,
        lowercase : true,
        required : true
    },
     password : {
        type : String,
        required : true
    },
},{timestamps:true});


// password convert into hash before save in db

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')){
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password ,salt );
    next();
});

userSchema.methods.comparePassword = async function (enteredPassword){
   return await bcrypt.compare(enteredPassword,this.password);
};

const User =  new mongoose.model('User',userSchema);


export default User