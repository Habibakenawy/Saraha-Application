import { UserModel, findOne, create, createOne ,updateOne} from "../../DB/index.js";
import { hashApproach } from "../../common/enum/security.enum.js";
import { BadRequestException, createLoginCredentials } from "../../common/utils/index.js";
import { Resend } from 'resend';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

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

    // 2. Generate a secure 6-digit OTP
  const rawOtp = crypto.randomInt(100000, 999999).toString();

  // 3. Hash OTP before saving to database
  const saltRounds = 10;
  const hashedOtp = await bcrypt.hash(rawOtp, saltRounds);

  // Set expiration (5 minutes from now)
  const otpExpiresIn = new Date(Date.now() + 5 * 60 * 1000);


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
      isEmailVerified: false,
      otpCode: hashedOtp,
      otpExpiresIn
    },
  });

  // 5. Dispatch plain-text OTP via Resend
  await sendOtpEmail(email, rawOtp);

  return {
    user,
    status: 201,
    message: 'User registered. Verification code sent to email.'
  };
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



export const sendOtpEmail = async (toEmail, otp) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    // Resend's default testing domain (send to your own registered email during test)
    // In production, replace with: 'noreply@yourdomain.com'
    from: 'onboarding@resend.dev',
    to: toEmail,
    subject: 'Your Verification Code',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Verify Your Email</h2>
        <p>Use the code below to complete your registration:</p>
        <h1 style="background: #f4f4f4; padding: 12px; text-align: center; letter-spacing: 6px; color: #333;">${otp}</h1>
        <p>This code will expire in <strong>5 minutes</strong>.</p>
      </div>
    `
  });

  if (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }

  return data;
};




export const verifyEmailOtp = async (data) => {
  const {email,submittedOtp} = data;
  const user = await findOne({
    model: UserModel,
    filter: { email: email.toLowerCase() }
  });

  // 1. Validate user and OTP existence
  if (!user || !user.otpCode || !user.otpExpiresIn) {
    throw new Error('Invalid verification request');
  }

  // 2. Check expiration
  if (new Date() > new Date(user.otpExpiresIn)) {
    throw new Error('Verification code has expired. Please request a new one.');
  }

  // 3. Compare submitted OTP against the hashed OTP in database
  const isMatch = await bcrypt.compare(submittedOtp, user.otpCode);
  if (!isMatch) {
    throw new Error('Invalid verification code');
  }

  // 4. Update user status and wipe OTP fields
  await updateOne({
    model: UserModel,
    filter: { _id: user._id },
    data: {
      isEmailVerified: true,
      otpCode: null,
      otpExpiresIn: null
    }
  });

  return {
    status: 200,
    message: 'Email verified successfully. You can now log in.'
  };
};