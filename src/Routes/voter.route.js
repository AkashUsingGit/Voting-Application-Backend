import { Router } from "express";
import { verifyJwt } from "../Middlewares/auth.middleware.js";

import {
    registerVoter,
    loginVoter,
    changePassword
} from "../Controllers/voter.controller.js"



const router = Router()

router.route("/register").post(registerVoter)
router.route("/login").post(loginVoter)
router.route("/updatepasssword").patch(verifyJwt,changePassword)

export default router;
