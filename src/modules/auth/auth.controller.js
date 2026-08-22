import { Router } from 'express'
import {  login, signup,signupWithGoogle,verifyEmailOtp} from './auth.service.js';
import {BadRequestException, successResponse} from './../../common/utils/response/index.js'
import joi from 'joi'
const router = Router(); 

const loginSchema = joi.object().keys({
    email:joi.string().email({minDomainSegments:2,maxDomainSegments:3,tlds:{allow:['com','net']}}).required(),
    password:joi.string().pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,16}$/)).required() //lazm n7ot $ fel a5er 3lshan el injection
 
}).required()

const sigupSchema = loginSchema.append().keys({
   username:joi.string().pattern(new RegExp(/^[A-Z]{1}[a-z]{1,24}\s[A-Z]{1}[a-z]{1,24}$/)).required().messages({
        "any.required":"username is required",
        "string.empty":"username cannot be empty"
    }),
    phone:joi.string().pattern(new RegExp(/^((00201|\+201|01)(0|1|2|5))\d{8}$/)).required(),
    confirmPassword:joi.string().valid(joi.ref("password")).required()
}).required()
router.post("/signup", async (req, res, next) => {
    const validationResult = sigupSchema.validate(req.body,{abortEarly:false});
    if(validationResult.error){
        throw BadRequestException({message:"validation error",extra:validationResult.error})
    }
    const result = await signup(req.body)
    return successResponse({res,status:201,message:"User Created Successfully",data:result})
})


router.get("/login", async (req, res, next) => {
    const validationResult = loginSchema.validate(req.body,{abortEarly:false});
    if(validationResult.error){
        throw BadRequestException({message:"validation error",extra:validationResult.error})
    }
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