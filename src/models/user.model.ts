import mongoose from "mongoose";

export interface IUser {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  mobile?: string;
  role: "user" | "deliveryBoy" | "admin";
  image?: string;
  location?: {
    type:{
      type: string;
      enum: string[];
      default: string;
    };
    coordinates:{
      type:NumberConstructor[];
      default:number[];
    }
  },
  socketId?: string | null;
  isOnline?: boolean;
}

const userSchema = new mongoose.Schema<IUser>({
  name:{
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: false,
  },
  mobile: {
    type: String,
    required: false
  },
  role: {
    type: String,
    enum: ["user", "deliveryBoy", "admin"],
    default: "user"
  },
  location:{
    type:{
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates:{
      type: [Number],
      default: [0,0]
    }
  },
  image: {
    type: String,
  },
  socketId:{
    type:String,
    default:null
  },
  isOnline:{
    type:Boolean,
    default:false
  }
}, { timestamps: true });

userSchema.index({ location: '2dsphere' });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;

