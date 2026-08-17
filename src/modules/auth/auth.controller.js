import { Router } from 'express'
import {  login, signup,signupWithGoogle,verifyEmailOtp} from './auth.service.js';
import {successResponse} from './../../common/utils/response/index.js'
const router = Router(); 
router.post("/signup", async (req, res, next) => {
    const result = await signup(req.body)
    return successResponse({res,status:201,message:"User Created Successfully",data:result})
})


router.get("/login", async (req, res, next) => {

    const {access_token,refresh_token} = await login(req.body,`${req.protocol}://${req.host}`)
    return successResponse({res,status:200,message:"User Logged Successfully",data:{access_token,refresh_token}})
})

router.post("/signup/gmail", async (req, res, next) => {
    console.log("Incoming Body:", req.body);
    const {status,credentials} = await signupWithGoogle(req.body.idToken,`${req.protocol}://${req.host}`)
    return successResponse({res,status:status,data:{...credentials}})
})

router.post("/verify-otp", async (req, res, next) => {
    const response = await verifyEmailOtp(req.body)
    return successResponse({res,status:200,message:"User Logged Successfully",data:response})
})

export default router