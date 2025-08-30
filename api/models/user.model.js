import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    img: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    desc: {
      type: String,
      required: false,
    },
    isSeller: {
      type: Boolean,
      default:false
    },
    role: { 
      type: String, 
      required: true, 
      default: 'user' 
    },
    isAdmin: { 
      type: Boolean, 
      required: true, 
      default: false 
    },
    tasks: [
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Task" 
      }
    ],
    isActive: { 
      type: Boolean, 
      required: true, 
      default: true 
    },
},{
    timestamps:true
});


export default mongoose.model("User", userSchema)


