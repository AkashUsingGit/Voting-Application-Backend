import { candidateModel } from "../Models/candidate.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { apiResponse } from "../utils/apiResponse.js"
import { apiError } from "../utils/apiError.js"


const registerCandidate = asyncHandler(async(req,res)=>{
    const { name, aadharNumber, age, party} = req.body

    const missingFields = [];
    if (!name) missingFields.push("name");
    if (!aadharNumber) missingFields.push("password");
    if (!age) missingFields.push("age");
    if (!party) missingFields.push("address");

    if (missingFields.length > 0) {
    return new apiError(400,`Missing required fields: ${missingFields.join(", ")}`)
    }

    console.log(name,aadharNumber,age,party)


    if(req.user.role==="admin"){

        const candidate = await candidateModel.create({
            name : name,
            aadharNumber : aadharNumber,
            age : age,
            party : party
        })

        if(!candidate){
            return new apiError(500, "Candidte registration failed")
        }

        console.log("candidate :", candidate)

        return res
        .status(200)
        .json(new apiResponse(200,candidate,"candidate created successfully"))
    }
    else{
        throw new apiError(400,"Only admin can create Candidate")
    }
        
    
    
    
})

const deleteCandidate = asyncHandler(async(req,res)=>{

    const { candidateId } = req.params

    if(!candidateId){
        throw new apiError(400,"candidate deletion failed")
    }

    console.log("candidateId :", candidateId)

    if(req.user.role==="admin"){
        const deleteCandidate = await candidateModel.findByIdAndDelete(candidateId)

        if(!deleteCandidate)
            throw new apiError(500,"candidate deletion failed")
        }

        console.log("deleteCandidate :",deleteCandidate)

        return res
        .status(200)
        .json(new apiResponse(200,deleteCandidate,"candidate deleted successfully"))
    }
)

const updateCandidate = asyncHandler(async(req,res)=>{

    const{ name, age } = req.body

    if(!name || !age){
        throw new apiError(404," name or age missing")
    }

    const { candidateId } = req.params

    if(!candidateId){
        throw new apiError(404,"missing candidate id")
    }


    if(req.user.role==="admin"){
        const updatedCandidate = await candidateModel.findByIdAndUpdate(candidateId,
            {
                $set : {
                    name,
                    age
                } 
            },
            {
                new :true
            }
    )

    if(!updatedCandidate){
        throw new apiError(500,"candidate updation failed")
    }

    return res
    .status(200)
    .json(new apiResponse(200,updatedCandidate,"Candidate detail updated successfully"))

}

throw new apiError(404,"Only admin can update candidate")

})

const allCandidates = asyncHandler(async(req,res)=>{

    const candidates = await candidateModel.find().select("-aadharNumber -votes -voteCount")

    if(candidates.length>0){
    return res
    .status(200)
    .json(new apiResponse(200,candidates,"Candidate found successfully"))
    }

    throw new apiError(404,"no candidate registered")
})

const voteCount = asyncHandler(async(req,res)=>{

    const candidates = await candidateModel.find().select("-aadharNumber -age").sort({voteCount : -1})

    if(candidates.length>0){
    return res
    .status(200)
    .json(new apiResponse(200,candidates,"Candidate vote count found successfully"))
    }

    throw new apiError(404,"no candidate registered")
})




export {
    registerCandidate,
    deleteCandidate,
    updateCandidate,
    allCandidates,
    voteCount
}



