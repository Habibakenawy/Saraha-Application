import { UserModel, findOne, create, createOne } from "../../DB/index.js";
import { hashApproach } from "../../common/enum/security.enum.js";
import { BadRequestException, createLoginCredentials } from "../../common/utils/index.js";
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
import {OAuth2Client}  from 'google-auth-library';
import { ProviderEnum } from "../../common/enum/user.enum.js";
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
    filter: { email , provider:ProviderEnum.System},
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
 return await createLoginCredentials(user,issuer);

};

const verifyGoogleAccount = async (idToken) =>{
const client = new OAuth2Client();

  const ticket = await client.verifyIdToken({
      idToken,
      audience: '833764307814-4pgebspmu261s2rv80iunmou11f8v11h.apps.googleusercontent.com',  // Specify the WEB_CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[WEB_CLIENT_ID_1, WEB_CLIENT_ID_2, WEB_CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  // This ID is unique to each Google Account, making it suitable for use as a primary key
  // during account lookup. Email is not a good choice because it can be changed by the user.
if(!payload?.email_verified){
  throw BadRequestException({message:"Fail to verify google"})
}
return payload;
}



export const signupWithGoogle = async (idToken,issuer) => {
  try {
    const payload = await verifyGoogleAccount(idToken);
    console.log("Google Payload:", payload);
    const checkExists = await findOne({
      model:UserModel,
      filter:{email:payload.email}
    })
      if(checkExists){
        if(checkExists.provider != ProviderEnum.Google)
         {throw ConflictException({message:"Invalid login provider"})}
        return {status:200,credentials:await loginWithGoogle(idToken,issuer)}
      }
      const user = await createOne({
      model:UserModel,
      data:{
        firstName:payload.given_name,
        lastName:payload.family_name,
        email:payload.email,
        profillePicture:payload.picture,
        confirmEmail:new Date(),
        provider: ProviderEnum.Google
      }
      })
    return {status:201,credentials:await createLoginCredentials(user,issuer)};
  } catch (error) {
    console.error("Google Auth Verification Error:", error.message);
    throw error;
  }
};


export const loginWithGoogle = async (idToken,issuer) => {
  try {
    const payload = await verifyGoogleAccount(idToken);
    console.log("Google Payload:", payload);
    const user = await findOne({
      model:UserModel,
      filter:{email:payload.email,provider:ProviderEnum.Google}
    })
      if(!user){
       throw NotFoundException({message:"This is not a registered account"})
      }
     
    return await createLoginCredentials(user,issuer);
  } catch (error) {
    console.error("Google Auth Verification Error:", error.message);
    throw error;
  }
};