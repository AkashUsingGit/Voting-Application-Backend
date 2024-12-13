import { Router } from "express";
import { verifyJwt } from "../Middlewares/auth.middleware.js";
import { castVote } from "../Controllers/vote.Controller.js"



const router = Router()


router.route("/castvote/:candidateId").post(verifyJwt,castVote)

export default router;