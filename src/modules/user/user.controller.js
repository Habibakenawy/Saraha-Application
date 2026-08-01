import { Router } from "express";
import { profile } from "./user.service.js";
const router=Router()

router.get("/" ,async (req,res,next)=>{
    const account = await profile(req.headers.authorization)
    return res.status(200).json({message:"Profile",data:account})
})
export default router