import { USER_REFRESH_TOKEN_SECRET_KEY,USER_ACCESS_TOKEN_SECRET_KEY } from "../../../../config/config.service.js";
import jwt from 'jsonwebtoken'
import { NotFoundException,BadRequestException, ConflictException} from "../response/error.response.js";
import { findOne } from "../../../DB/DB.repository.js";
import { UserModel } from "../../../DB/index.js";
import { TokenTypeEnum } from "../../enum/security.enum.js";



export const  generateToken = async ({payload = {},secret = USER_ACCESS_TOKEN_SECRET_KEY,options = {}}) =>{
    return jwt.sign(payload,secret,options);
}


export const  verifyToken = async ({token,secret = USER_ACCESS_TOKEN_SECRET_KEY}) =>{
    return jwt.verify(token,secret);
}

export const getTokenSignature = async ({tokenType= TokenTypeEnum.Access}= {})=>{
    let signature = undefined;
    switch(tokenType){
        case TokenTypeEnum.Refresh:
            signature=USER_REFRESH_TOKEN_SECRET_KEY;
            break;
        default:
            signature=USER_ACCESS_TOKEN_SECRET_KEY;
            break;
    }
      return signature;
}

export const decodeToken = async ({token,tokenType=TokenTypeEnum.Access}={}) =>{
        const decodeToken = jwt.decode(token);
        if(!decodeToken?.aud?.length){
            throw BadRequestException({message:"Missing token audience"})
        }
        const [tokenApproach] = decodeToken.aud || [];
        if(tokenType!==tokenApproach){
throw ConflictException({message:`Unexpected token mechanism we expected ${tokenType} while you sent ${tokenApproach}`})
        }
  const secret = await getTokenSignature({tokenType:tokenApproach})
  console.log(secret)
    const verifiedData = jwt.verify(token,secret);
  console.log({verifiedData})
    const user= await findOne({model:UserModel,filter:{_id:verifiedData.sub}})

    if (!user){
        throw NotFoundException({message:"This is not registered"})
    } 

    return user;
}


export const createLoginCredentials = async (user,issuer) =>{
  const access_token = await generateToken({
   payload: { sub: user._id, extra: 250 }, //payload
   secret: USER_ACCESS_TOKEN_SECRET_KEY,
   options: {  //options
  //  subject:user.id //lazm string w lw ktbt sub fo2 mktbsh hna subject tany
   // ,
    issuer,//mean tl3le el token
    audience:[TokenTypeEnum.Access] //meen y2dr yshofha 
    ,expiresIn: 1800//sanya which is equal nos sa3a
    }}
  );


    const refresh_token = await generateToken({
  payload:  { sub: user._id, extra: 250 }, //payload
  secret:  USER_REFRESH_TOKEN_SECRET_KEY,
  options:  {  //options
  // subject:user.id lazm string w lw ktbt sub fo2 mktbsh hna subject tany
  //  ,
    issuer,//mean tl3le el token
    audience:[TokenTypeEnum.Refresh] //meen y2dr yshofha 
    ,expiresIn: 60 * 60 *24 * 365 // sana
    }
});

  return {access_token,refresh_token};
}