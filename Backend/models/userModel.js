import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      // never send the password hash to the client
      transform: (_doc, ret) => {
        delete ret.password;
        return ret;
      },
    },
  }
);
const User = mongoose.model("Users", userSchema);

export default User;
