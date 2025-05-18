const mongoose = require("mongoose");
const validator = require("validator");

// name , password , email , confirm password , photo
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required field"],
  },
  email: {
    type: String,
    required: [true, "Email is required field"],
    unique: true,
    validate: [validator.isEmail, "Enter proper Email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required field"],
    unique: true,
    minLength: 8,
  },
  confirmPassword: {
    type: String,
    required: [true, "Please Confirm your Password"],
    unique: true,
  },
  photo: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
