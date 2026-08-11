import { TokenTypeEnum } from "../common/enum/index.js";
import { decodeToken } from "../common/utils/index.js";



export const authentiction = (tokenType = TokenTypeEnum.Access) => {
return async (req,res,next) => {
   req.user = await decodeToken({token:req.headers.authorization,tokenType})
    next();
}
}