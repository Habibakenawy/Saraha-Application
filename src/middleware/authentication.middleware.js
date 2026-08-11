import { TokenTypeEnum } from "../common/enum/index.js";
import {
  BadRequestException,
  decodeToken,
  ForbiddenException,
  UnauthorizedException,
} from "../common/utils/index.js";
import { login } from "../modules/auth/auth.service.js";

export const authentiction = (tokenType = TokenTypeEnum.Access) => {
  return async (req, res, next) => {
    // const {authorization} = req.headers;
    // console.log(authorization);
    //bn7ot Bearer abl el token 3lshan nfr2 mabeen el protocols
    const [schema, credentials] = req.headers.authorization?.split(" ");
    if (!schema || !credentials) {
      throw UnauthorizedException();
    }
    switch (schema) {
      case "Basic":
        const [email, password] =
          Buffer.from(credentials, "base64")?.toString()?.split(" ") || [];
        console.log(email, password);
        await login({ email, password }, `${req.protocol}://${req.host}`);
        break;
      case "Bearer":
        req.user = await decodeToken({ token: credentials, tokenType });
        break;
      default:
        throw BadRequestException({ message: "Missing authentication schema" });
    }
    next();
  };
};

export const authorization = (accessRoles = []) => {
  return async (req, res, next) => {
    if (!accessRoles.includes()) {
      throw ForbiddenException({
        message: "This is not an authorized account",
      });
    }
    next();
  };
};
