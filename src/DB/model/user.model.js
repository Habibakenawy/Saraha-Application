import mongoose from "mongoose";
import {GenderEnum,ProviderEnum, RoleEnum} from '../../common/enum/index.js'

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: [
        2,
        `Name must be more than 2 characters but you entered {VALUE}`,
      ],
      maxLength: 25,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      minLength: [
        2,
        `Name must be more than 2 characters  but you entered {VALUE}`,
      ],
      maxLength: 25,
      trim: true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
      password:{
        type:String,
        required:true
    },
    phone:String,
    confirmEmail:Date,
    changeCredentialsTime:Date,
    provider:{
        type:Number,
        enum:Object.values(ProviderEnum),
        default:ProviderEnum.System
    },
    gender:{
        type:Number,
        enum:Object.values(GenderEnum),
        default:GenderEnum.Male
    },
    role:{
        type:Number,
        enum:Object.values(RoleEnum),
        default:RoleEnum.User
    },
    profilePicture:String,
    coverProfilePictures:[String]
  },
  {collection:"Route_Users",
    timeStamp:true,
    strict:true,
    strictQuery:true,
    optimisticConcurrency:true,
    autoIndex:true,
    toObject: { virtuals: true }, 
    toJSON: { virtuals: true }
  },
);

UserSchema.virtual("username").set(function(value){
    const [firstName,lastName] = value.split(' ') || [];
    this.set({firstName,lastName});
}).get(function(){
    return this.firstName + " " + this.lastName;
})


export const UserModel = mongoose.models.User || mongoose.model("User",UserSchema);