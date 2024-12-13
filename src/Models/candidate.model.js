import mongoose from "mongoose";
import { Schema } from "mongoose";

const candidateSchema = new Schema({
    name : {
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
    party : {
        type : String,
        required : true
    },
    votes : [
            {
                voter : {
                    type : mongoose.Schema.ObjectId,
                    ref : 'voterModel',
                    required : true
                },
                votedAt : {
                    type : Date,
                    default : Date.now()
                }
            }
    ],
    voteCount : {
        type : Number,
        default : 0
    }
})

export const candidateModel = mongoose.model("candidateModel",candidateSchema)