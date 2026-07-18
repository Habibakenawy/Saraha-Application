import {mongoose} from "mongoose"
import {DB_URI} from "../../config/config.service.js"



export const authenticateDB = async () =>{
    try{
        const dbConnectionResult = await mongoose.connect(DB_URI);
        console.log({dbConnectionResult})

    }catch(err){
        console.log(`failed to connect ${err}`)
    }
}