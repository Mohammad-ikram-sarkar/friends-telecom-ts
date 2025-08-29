import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String, // ✅ Capital S
    required: [true, "Please provide a username"],

},
  email: {
    type: String, // ✅ Capital S
    required: [true, "Please provide an email"],
    unique: true,
  },
  password: {
    type: String, // ✅ Capital S
    required: [true, "Please provide a password"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  forgotPasswordToken: String, // ✅ Capital S
  forgetPasswordTokenExpire: Date,
  verifyToken: String,         // ✅ Capital S
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
