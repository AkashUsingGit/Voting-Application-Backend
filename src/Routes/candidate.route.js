import { Router } from "express";
import { verifyJwt } from "../Middlewares/auth.middleware.js";


import {
    registerCandidate,
    deleteCandidate,
    updateCandidate,
    allCandidates,
    voteCount
} from "../Controllers/candidate.controller.js"

const router = Router()

router.route("/register").post(verifyJwt,registerCandidate)
router.route("/delete/:candidateId").delete(verifyJwt,deleteCandidate)
router.route("/update/:candidateId").patch(verifyJwt,updateCandidate)
router.route("/allcandidates").get(allCandidates)
router.route("/votecount").get(voteCount)


export default router;
