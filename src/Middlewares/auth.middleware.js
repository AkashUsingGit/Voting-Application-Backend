import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js"
import { voterModel } from "../Models/voter.model.js"

const verifyJwt =asyncHandler (async(req,res,next)=>{

    try {
        const accessToken = req.header("Authorization")?.replace("Bearer ","")

        // req.cookies?.refreshToken || 
    
        if(!accessToken){
            throw new apiError(404,"login first")
        }

        // console.log("accessToken : ",  accessToken)
    
        const decodedToken = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)

        if(!decodedToken){
            throw new apiError(404,"Token verification failed")
        }

        // console.log(decodedToken)
    
        const voter = await voterModel.findById(decodedToken._id).select("-password -refreshTOken")
    
        if(!voter){
            throw new apiError(404,"invalid access token")
        }
    
        req.user=voter
        console.log("voter :",req)
        next()
    } catch (error) {
        throw new apiError(400,"Invalid access Token")
    }

})

export {verifyJwt}