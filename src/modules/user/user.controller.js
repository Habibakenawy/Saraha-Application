import { Router } from "express";
import { profile, rotateToken } from "./user.service.js";
import { authentiction } from "../../middleware/index.js";
import { TokenTypeEnum } from "../../common/enum/index.js";
const router=Router()

router.get("/" ,authentiction(),async (req,res,next)=>{
    const account = await profile(req.user)
    return res.status(200).json({message:"Profile",data:account})
})

router.get("/rotate-token" ,authentiction(TokenTypeEnum.Refresh),async (req,res,next)=>{
    const  credentials = await rotateToken(req.user,`${req.protocol}://${req.host}`)
    return res.status(200).json({message:"Profile",data: credentials})
})
export default router