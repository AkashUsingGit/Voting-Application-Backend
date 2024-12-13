import { voteModel } from "../Models/vote.model.js"
import { candidateModel } from "../Models/candidate.model.js"
import { apiError } from "../utils/apiError.js"
import { apiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const castVote = asyncHandler(async(req,res)=>{

    const {candidateId} = req.params


    if(!candidateId){
        throw new apiError(400,"candidate id missing!")
    }

    console.log(candidateId)

    if(req.user.role=="voter"){
        const vote = await voteModel.create({
            candidate : candidateId,
            voter : req.user._id
        })

        if(!vote){
            throw new apiError(500,"vote casting failed!!")
        }

        console.log("vote :",vote)

        const candidate = await candidateModel.findById(candidateId)

        if(!candidate){
            throw new apiError(400,"candidate not found!")
        }

        candidate.votes.push(
            {
                voter: req.user._id,
                votedAt: vote.createdAt,
            }
        )

        candidate.voteCount+= 1

        await candidate.save()

        return res
        .status(200)
        .json(new apiResponse(200,vote,"vote casted successfully!!"))
    }

    throw new apiError(500,"Admin is not allowed to vote")
})



export {castVote}

