import { UserModel } from "../../DB/model/user.model.js";

export const signup = async (inputs) => {
    const {username,email,password,phone} = inputs;
    const userExists = await UserModel.findOne({email});
    if(userExists){
        return ConflictException({message:"This email already exists"});
    }
    const [user] =await UserModel.create([{username,email,password,phone}]);
    return user;
}


export const login = async (inputs) => {
    const {email,password} = inputs;
    const user = await UserModel.findOne({email});
    if(!user){
        return NotFoundException({message:"Invalid Login Credentials"});
    }
    return user;
}

