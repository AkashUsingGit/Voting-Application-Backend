import { voterModel } from "../Models/voter.model.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { apiResponse } from "../utils/apiResponse.js"
import { apiError } from "../utils/apiError.js"


const generateAccessAndRefreshToken = async (voterId)=>{

    console.log("voter Id : " , voterId)
    const voter = await voterModel.findById(voterId)
    if (!voter) {
        throw new apiError(404, 'voter not found');
    }

    console.log("voter :" , voter)
    const accessToken = await voter.generateAccessToken()
    const refreshToken = await voter.generateRefreshToken()

    console.log("accessToken : ", accessToken)
    console.log("refreshToken : ", refreshToken)

    voter.refreshToken=refreshToken
    voter.save({ validateBeforeSave: false })

    return {accessToken,refreshToken}
}

const registerVoter = asyncHandler(async (req,res)=>{

const { name, password, aadharNumber, age, address, email } = req.body

console.log(name,password, aadharNumber, age, address)


// if(!name || !password || !aadharNumber || !age || !address){
//     throw new apiError(409,"credentials not received")
// }


const missingFields = [];
if (!name) missingFields.push("name");
if (!password) missingFields.push("password");
if (!aadharNumber) missingFields.push("aadharNumber");
if (!age) missingFields.push("age");
if (!address) missingFields.push("address");

if (missingFields.length > 0) {
    throw new apiError(400,`Missing required fields: ${missingFields.join(", ")}`)
}


const voter = await voterModel.findOne({aadharNumber})

if(voter){
   throw new apiError(409,"voter already exist")
}

const CreatedVoter = await voterModel.create({
    name,
    password,
    aadharNumber,
    age,
    address,
    email : email? email : ""
})

if(!CreatedVoter){
    throw new apiError(500,"something went wrong while registering voter")
}

const newCreatedVoter = await voterModel.findById(CreatedVoter._id).select("-password -refreshToken")

return res
.status(200)
.json(new apiResponse(200,newCreatedVoter,"voter created successfully"))

})

const loginVoter = asyncHandler(async (req,res)=>{
    const {aadharNumber, password} = req.body

    if(!aadharNumber || !password){
        throw new apiError(400,"aadharNumber or Password missing")
    }

    const voterExist = await voterModel.findOne({aadharNumber})

    if(!voterExist){
        throw new apiError(404,"voter doesnt exist")
    }

    console.log("voter Found : ", voterExist)

    const checkPassword =await voterExist.isPasswordCorrect(password)

    if(!checkPassword){
        throw new apiError(404,"invalid password")
    }

    console.log("password Correct")

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(voterExist._id)

    console.log("inside controller : ",accessToken,refreshToken)

    if(!accessToken || !refreshToken){
        throw new apiError(500, "login failed")
    }

    const loggedinVoter = await voterModel.findById(voterExist._id).select("-paassword")

    
    const options = {
        httpOnly : true,
        secure : true
    }
    

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json( new apiResponse(200,{
        user : loggedinVoter, accessToken, refreshToken
    },
     "logged in succesfully"))

})

const changePassword = asyncHandler(async(req,res)=>{

    const{ password, newPassword } = req.body

    const user = await voterModel.findById(req.user._id)

    if(!user){
        throw new apiError(400,"user not found")
    }

    const passwordCorrect = await user.isPasswordCorrect(password)

    if(!passwordCorrect){
        throw new apiError(400,"password didn't match")
    }

    user.password = newPassword

    await user.save()

    return res
    .status(200)
    .json(new apiResponse(200,"password changed"))

})

export {
    registerVoter,
    loginVoter,
    changePassword
}