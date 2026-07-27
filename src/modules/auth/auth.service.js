import { UserModel,findOne ,create, createOne} from "../../DB/index.js";
import { hashApproach } from "../../common/enum/security.enum.js";
import { compareHash, ConflictException,NotFoundException } from "../../common/utils/index.js";
import { generateHash } from "../../common/utils/index.js";



export const signup = async (inputs) => {
    const {username,email,password,phone} = inputs;
    const userExists = await findOne({model:UserModel,filter:{email}})
    if(userExists){
        return ConflictException({message:"This email already exists"});
    }
    const user =await createOne({model:UserModel,data:{username,email, password: await generateHash({plaintext:password,approach:hashApproach.bcrypt}) ,phone}})
    return user;
}


export const login = async (inputs) => {
    const {email,password} = inputs;
    const user = await findOne({model:UserModel,filter:{email},options:{lean:true}})
    if(!user){
        return NotFoundException({message:"Invalid Login Credentials"});
    }
        if(! await compareHash({plaintext:password,ciphertext:user.password})){
        return NotFoundException({message:"Invalid Login Credentials"});
    }
    return user;
}

