import { ACCESS_TOKEN_SECRET } from "../../../config/config.service.js";
import { findOne } from "../../DB/DB.repository.js"
import { UserModel } from "../../DB/index.js"
import jwt from 'jsonwebtoken'

export const profile   =  async (token)=>{
    const decodeToken = jwt.decode(token);
    const verifiedData = jwt.verify(token,ACCESS_TOKEN_SECRET);
  console.log({verifiedData})
    const account = await findOne({model:UserModel,filter:{_id:verifiedData.sub}})
     return account;
}