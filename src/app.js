import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express()

app.use(cors({
    origin : process.env.CORS_ORIGIN,
}))

app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({extended: true }))
app.use(express.static("public"))
app.use(cookieParser())


import candidateRoute from "./Routes/candidate.route.js"
import voterRoute from "./Routes/voter.route.js"
import voteRoute from "./Routes/vote.route.js"

app.use("/api/v1/candidate",candidateRoute)
app.use("/api/v1/voter",voterRoute)
app.use("/api/v1/vote",voteRoute)


export default app