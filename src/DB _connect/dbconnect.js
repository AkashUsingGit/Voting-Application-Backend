import mongoose from "mongoose";
import { seedAdmin } from "../Controllers/admin.controller.js";


async function ConnectDB(){
    try{
        const connection = await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,  // Ensures MongoDB URL string compatibility
            useUnifiedTopology: true,  // Ensures proper connection management
        })
        console.log("Database Connected!!!")
        await seedAdmin()

    }catch(error){
        console.log("Database Connection Error", error)

        process.exit(1);
    }
}

export { ConnectDB }