import mongoose from "mongoose";
import { Schema } from "mongoose";
import { candidateModel } from "./candidate.model.js";
import { voterModel } from "./voter.model.js";

const voteSchema = new Schema({
    candidate : {
        type : mongoose.Schema.ObjectId,
        ref : candidateModel
    },
    voter : {
        type : mongoose.Schema.ObjectId,
        ref : voterModel
    }

})

export const voteModel = mongoose.model("voteModel",voteSchema)