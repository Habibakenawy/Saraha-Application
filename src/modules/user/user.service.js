import { USER_ACCESS_TOKEN_SECRET_KEY } from "../../../config/config.service.js";
import { NotFoundException } from "../../common/utils/index.js";
import { findOne } from "../../DB/DB.repository.js"
import { UserModel } from "../../DB/index.js"
import jwt from 'jsonwebtoken'

export const profile   =  async (token)=>{
    const decodeToken = jwt.decode(token);
    const verifiedData = jwt.verify(token,USER_ACCESS_TOKEN_SECRET_KEY);
  console.log({verifiedData})
    const account = await findOne({model:UserModel,filter:{_id:verifiedData.sub}})
     return account;
}

export const rotateToken   =  async (token,issuer)=>{
    const decodeToken = jwt.decode(token);
    const verifiedData = jwt.verify(token,USER_REFRESH_TOKEN_SECRET_KEY);
  console.log({verifiedData})
    const user = await findOne({model:UserModel,filter:{_id:verifiedData.sub}})
    if(!user){
      throw NotFoundException({message:"This is not a registered account"})
    }
      const access_token = jwt.sign(
        { sub: user._id, extra: 250 }, //payload
        USER_ACCESS_TOKEN_SECRET_KEY,
        {  //options
      //  subject:user.id //lazm string w lw ktbt sub fo2 mktbsh hna subject tany
       // ,
        issuer,//mean tl3le el token
        audience:['web','mobile'] //meen y2dr yshofha 
        ,expiresIn: 1800//sanya which is equal nos sa3a
        }
      );
    
    
        const refresh_token = jwt.sign(
        { sub: user._id, extra: 250 }, //payload
        USER_REFRESH_TOKEN_SECRET_KEY,
        {  //options
      // subject:user.id lazm string w lw ktbt sub fo2 mktbsh hna subject tany
      //  ,
        issuer,//mean tl3le el token
        audience:['web','mobile'] //meen y2dr yshofha 
        ,expiresIn: 60 * 60 * 24 * 365
        }
      );
      return {access_token,refresh_token};
}



// [ FRONTEND ]                                 [ BACKEND / DATABASE ]
//         |                                                 |
//         |--- 1. Request profile with access_token ------->|
//         |                                                 | Calls profile(token)
//         |<-- 2. Success! User account data ---------------| Returns user data
//         |                                                 |
//    ( 30 mins pass... access_token expires! )              |
//         |                                                 |
//         |--- 3. Request profile with access_token ------->|
//         |                                                 | Calls profile(token)
//         |<-- 4. ERROR! TokenExpiredError -----------------| jwt.verify throws error
//         |                                                 |
//         |=== FRONTEND SEES ERROR, SWITCHES TO ROTATING ======================|
//         |                                                 |
//         |--- 5. Request new tokens using refresh_token -->|
//         |                                                 | Calls rotateToken(token)
//         |<-- 6. Returns NEW access_token + refresh_token -| Generates new pair
//         |                                                 |
//         |=== FRONTEND RETRIES ORIGINAL REQUEST ==============================|
//         |                                                 |
//         |--- 7. Request profile with NEW access_token --->|
//         |                                                 | Calls profile(token)
//         |<-- 8. Success! User account data ---------------| Returns user data