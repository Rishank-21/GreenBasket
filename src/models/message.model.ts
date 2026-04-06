import mongoose from "mongoose";

export interface IMassage {
  _id?: mongoose.Types.ObjectId | string;
  roomId: mongoose.Types.ObjectId | string;
  text: string;
  senderId: mongoose.Types.ObjectId | string;
  time: string;
  createdAt?: Date;
  updatedAt?: Date;
}


const messageSchema = new mongoose.Schema<IMassage>({
    roomId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Order"
    },
    text:{
        type:String
    },
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    time:{
        type:String
    }
},{timestamps:true})

const Message = mongoose.models.Message || mongoose.model("Message", messageSchema)
export default Message
