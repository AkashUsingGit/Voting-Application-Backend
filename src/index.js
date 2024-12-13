import { ConnectDB } from "./DB _connect/dbconnect.js"
import app from "./app.js"

console.log("server :",process.env.PORT)

ConnectDB()
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log("server running at port", process.env.PORT)
        
    })
})
.catch((error)=>{
    console.log("Database Connection Failed")
})