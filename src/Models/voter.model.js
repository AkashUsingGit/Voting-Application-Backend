import mongoose from "mongoose";
import { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const voterSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    aadharNumber : {
        type : Number,
        required : true,
        unique : true
    },
    age : {
        type : Number,
        required : true
    },
    address : {
        type : String,
        required : true
    },
    email :{
        type : String,
    },
    role : {
        type : String,
        enum : ["admin","voter"],
        default : "voter"
    },
    refreshToken:{
        type : String
    }
})

voterSchema.pre("save",async function(next){
    if(this.isModified('password')){
        try{
            this.password = await bcrypt.hash(this.password,10)
            console.log('Hashed password:', this.password); 
        }
        catch(error){
            console.error("Error Hashing Password :" , error)
            next(error)
        }
    }
    next()
})

voterSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

voterSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id : this._id
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn : process.env.ACCESS_TOKEN_EXPIRY
    }
)}

voterSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id : this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn :process.env.REFRESH_TOKEN_EXPIRY 
    }
)}

export const voterModel = mongoose.model("voterModel",voterSchema)