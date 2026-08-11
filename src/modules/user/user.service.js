import { USER_ACCESS_TOKEN_SECRET_KEY ,USER_REFRESH_TOKEN_SECRET_KEY} from "../../../config/config.service.js";
import { TokenTypeEnum } from "../../common/enum/security.enum.js";
import { createLoginCredentials, decodeToken, NotFoundException } from "../../common/utils/index.js";
import { findOne } from "../../DB/DB.repository.js"
import { UserModel } from "../../DB/index.js"
import jwt from 'jsonwebtoken'

export const profile   =  async (user)=>{

     return user;
}

export const rotateToken   =  async (user,issuer)=>{

     return createLoginCredentials(user,issuer);
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