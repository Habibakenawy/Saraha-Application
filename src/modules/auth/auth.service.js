import { UserModel, findOne, create, createOne } from "../../DB/index.js";
import { hashApproach } from "../../common/enum/security.enum.js";
import {
  compareHash,
  ConflictException,
  generateDecryption,
  generateEncryption,
  NotFoundException,
} from "../../common/utils/index.js";
import { generateHash } from "../../common/utils/index.js";
import {USER_REFRESH_TOKEN_SECRET_KEY,USER_ACCESS_TOKEN_SECRET_KEY } from "../../../config/config.service.js";
import jwt from "jsonwebtoken";

export const signup = async (inputs) => {
  const { username, email, password, phone } = inputs;
  const userExists = await findOne({ model: UserModel, filter: { email } });
  if (userExists) {
    return ConflictException({ message: "This email already exists" });
  }
  const user = await createOne({
    model: UserModel,
    data: {
      username,
      email,
      password: await generateHash({
        plaintext: password,
        approach: hashApproach.bcrypt,
      }),
      phone: await generateEncryption(phone),
    },
  });
  return user;
};

export const login = async (inputs,issuer) => {
  const { email, password } = inputs;
  const user = await findOne({
    model: UserModel,
    filter: { email },
    options: { lean: true },
  });
  if (!user) {
    return NotFoundException({ message: "Invalid Login Credentials" });
  }
  if (
    !(await compareHash({ plaintext: password, ciphertext: user.password }))
  ) {
    return NotFoundException({ message: "Invalid Login Credentials" });
  }
  user.phone = await generateDecryption(user.phone);
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
    ,expiresIn: 1800//sanya which is equal nos sa3a
    }
  );
  return {access_token,refresh_token};
};
