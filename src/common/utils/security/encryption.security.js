import crypto from "node:crypto";
import {
  ENC_SECRET_KEY,
  IV_LENGTH,
} from "../../../../config/config.service.js";

//console.log(crypto.randomBytes(IV_LENGTH).toString('hex')) TO GENERATE SECRET KEY
//iv length 16 bytes <bydrb internally f 2 3lshan yb2a 32>
//key 32  bytes
//Iv stands for initialized vector

export const generateEncryption = async (plaintext) => {
    console.log(ENC_SECRET_KEY.length)
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipherIV = crypto.createCipheriv("aes-256-cbc", ENC_SECRET_KEY, iv);
  let cipherText = cipherIV.update(plaintext, "utf-8", "hex");
  cipherText += cipherIV.final("hex");

  return `${iv.toString("hex")}:${cipherText}`;
};

export const generateDecryption = async (cipherText) => {
  const [iv, encryptedData] = cipherText.split(":") || [];
  const ivLikeBinary = Buffer.from(iv, "hex");
  let decipherIv = crypto.createDecipheriv(
    "aes-256-cbc",
    ENC_SECRET_KEY,
    ivLikeBinary,
  );
  let plaintext = decipherIv.update(encryptedData, "hex", "utf-8");
  plaintext += decipherIv.final("utf-8");
  console.log({ iv, ivLikeBinary, encryptedData });
  return plaintext;
};
