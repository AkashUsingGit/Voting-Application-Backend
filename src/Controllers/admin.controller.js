import { voterModel } from "../Models/voter.model.js";
import bcrypt from "bcrypt"


export async function seedAdmin(){

    try{
    
        const adminFound = await voterModel.findOne({role : "admin"})
    
        if(!adminFound){
            const admin = await voterModel.create(
                {
                    name : "admin",
                    password : "adminPassword123",
                    aadharNumber : "12345678",
                    role : "admin",
                    address : "adminaddress",
                    age : 40
                }
            )

        
            console.log('Admin user created successfully');
        }
    }
    catch(error){
        console.error('Error creating admin user:', error);
    }


}