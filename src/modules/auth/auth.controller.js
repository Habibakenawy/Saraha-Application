import { Router } from 'express'
import {  login, signup } from './auth.service.js';
import {successResponse} from './../../common/utils/response/index.js'
const router = Router(); 
router.post("/signup", async (req, res, next) => {
    const result = await signup(req.body)
    return successResponse({res,status:201,message:"User Created Successfully",data:result})
})


router.get("/login", async (req, res, next) => {
    const credentials = await login(req.body)
    return successResponse({res,status:200,message:"User Logged Successfully",data:{credentials}})
})


export default router