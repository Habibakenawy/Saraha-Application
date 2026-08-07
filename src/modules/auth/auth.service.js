import { UserModel, findOne, create, createOne } from "../../DB/index.js";
import { hashApproach } from "../../common/enum/security.enum.js";
import { createLoginCredentials } from "../../common/utils/index.js";
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
 return await createLoginCredentials(user,issuer);

};
