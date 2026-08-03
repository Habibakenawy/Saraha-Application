import { Router } from "express";
import { profile, rotateToken } from "./user.service.js";
const router=Router()

router.get("/" ,async (req,res,next)=>{
    const account = await profile(req.headers.authorization)
    return res.status(200).json({message:"Profile",data:account})
})

router.get("/rotate-token" ,async (req,res,next)=>{
    const  credentials = await rotateToken(req.headers.authorization,`${req.protocol}://${req.host}`)
    return res.status(200).json({message:"Profile",data: credentials})
})
export default router