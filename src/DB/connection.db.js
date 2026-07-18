import {mongoose} from "mongoose"
import {DB_URI} from "../../config/config.service.js"
import { UserModel } from "./model/user.model.js";



export const authenticateDB = async () =>{
    try{
        const dbConnectionResult = await mongoose.connect(DB_URI);
        console.log({dbConnectionResult})
        await UserModel.syncIndexes;

    }catch(err){
        console.log(`failed to connect ${err}`)
    }
}