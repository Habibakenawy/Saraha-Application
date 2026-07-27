import {hash,compare, genSalt} from 'bcrypt';
import { SALT_ROUND } from '../../../../config/config.service.js';
import { hashApproach } from '../../enum/security.enum.js';
import  argon2 from "argon2";


export const generateHash = async ({plaintext,salt=SALT_ROUND,minor='b',approach=hashApproach.bcrypt}={}) =>{
    let hashValue;
    switch(approach){
     case hashApproach.argon2:
     hashValue= await hash
     break;
     default:
    const generatedSalt  = await genSalt(SALT_ROUND,minor);
     hashValue = await hash(plaintext,generatedSalt);
    break;
}
return hashValue;
}


export const compareHash = async ({plaintext,ciphertext,approach=hashApproach.bcrypt}={}) => {
let match = false;
switch (approach){
    case hashApproach.argon2:
     match = argon2.verify(ciphertext,plaintext)
     break;
    default:
    match = await compare (plaintext,ciphertext);
    break;
}
return match;
}

