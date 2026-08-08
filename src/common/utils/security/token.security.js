import {
  USER_REFRESH_TOKEN_SECRET_KEY,
  USER_ACCESS_TOKEN_SECRET_KEY,
  SYSTEM_REFRESH_TOKEN_SECRET_KEY,
  SYSTEM_ACCESS_TOKEN_SECRET_KEY,
  REFRESH_TOKEN_EXPIRES_IN,
  ACCESS_TOKEN_EXPIRES_IN,
} from "../../../../config/config.service.js";
import jwt from "jsonwebtoken";
import {
  NotFoundException,
  BadRequestException,
  ConflictException,
} from "../response/error.response.js";
import { findOne } from "../../../DB/DB.repository.js";
import { UserModel } from "../../../DB/index.js";
import { TokenTypeEnum } from "../../enum/security.enum.js";
import { RoleEnum } from "../../enum/user.enum.js";

export const generateToken = async ({
  payload = {},
  secret = USER_ACCESS_TOKEN_SECRET_KEY,
  options = {},
}) => {
  return jwt.sign(payload, secret, options);
};

export const verifyToken = async ({
  token,
  secret = USER_ACCESS_TOKEN_SECRET_KEY,
}) => {
  return jwt.verify(token, secret);
};

export const detectSignaturesLevel = async (level) => {
  let signatures = {accessSignature:undefined,refreshSignature:undefined};
  switch (level) {
    case RoleEnum.Admin:
      signatures = {accessSignature:SYSTEM_ACCESS_TOKEN_SECRET_KEY,refreshSignature:SYSTEM_REFRESH_TOKEN_SECRET_KEY};
      break;
    default:
      signatures = {accessSignature:USER_ACCESS_TOKEN_SECRET_KEY,refreshSignature:USER_REFRESH_TOKEN_SECRET_KEY};
      break;
  }
  return signatures;
};


export const getTokenSignature = async ({
  tokenType = TokenTypeEnum.Access,level
} = {}) => {
  let signature = undefined;
  const {accessSignature,refreshSignature} = await detectSignaturesLevel(level)
  switch (tokenType) {
    case TokenTypeEnum.Refresh:
      signature = refreshSignature;
      break;
    default:
      signature = accessSignature;
      break;
  }
  return signature;
};

export const decodeToken = async ({
  token,
  tokenType = TokenTypeEnum.Access,
} = {}) => {
  const decodeToken = jwt.decode(token);
  if (!decodeToken?.aud?.length) {
    throw BadRequestException({ message: "Missing token audience" });
  }
  const [tokenApproach,level] = decodeToken.aud || [];
  if (tokenType !== tokenApproach) {
    throw ConflictException({
      message: `Unexpected token mechanism we expected ${tokenType} while you sent ${tokenApproach}`,
    });
  }
  const secret = await getTokenSignature({ tokenType: tokenApproach,level });
  console.log(secret);
  const verifiedData = jwt.verify(token, secret);
  console.log({ verifiedData });
  const user = await findOne({
    model: UserModel,
    filter: { _id: verifiedData.sub },
  });

  if (!user) {
    throw NotFoundException({ message: "This is not registered" });
  }

  return user;
};

export const createLoginCredentials = async (user, issuer) => {
  const {accessSignature,refreshSignature} = await detectSignaturesLevel(user.role)
  const access_token = await generateToken({
    payload: { sub: user._id, extra: 250 }, //payload
    secret: accessSignature,
    options: {
      //options
      //  subject:user.id //lazm string w lw ktbt sub fo2 mktbsh hna subject tany
      // ,
      issuer, //mean tl3le el token
      audience: [TokenTypeEnum.Access,user.role], //meen y2dr yshofha
      expiresIn: ACCESS_TOKEN_EXPIRES_IN, //sanya which is equal nos sa3a
    },
  });

  const refresh_token = await generateToken({
    payload: { sub: user._id, extra: 250 }, //payload
    secret: refreshSignature,
    options: {
      //options
      // subject:user.id lazm string w lw ktbt sub fo2 mktbsh hna subject tany
      //  ,
      issuer, //mean tl3le el token
      audience: [TokenTypeEnum.Refresh,user.role], //meen y2dr yshofha
      expiresIn: REFRESH_TOKEN_EXPIRES_IN, // sana
    },
  });

  return { access_token, refresh_token };
};
