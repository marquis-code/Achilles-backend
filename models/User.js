const mongoose = require('mongoose');
let UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is required"],
      minlength: [3, "First Name can't be smaller than 3 characters"],
      maxlength: [64, "First Name can't be greater than 64 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is required"],
      minlength: [3, "Last Name can't be smaller than 3 characters"],
      maxlength: [64, "Last Name can't be greater than 64 characters"],
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: [true, "Email is required"],
      match: [
        /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@[*[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+]*/,
        "Please provide a valid email address",
      ],
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      minlength: [3, "Department can't be smaller than 3 characters"],
      maxlength: [64, "Department can't be greater than 64 characters"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [3, "Password can't be smaller than 3 characters"],
      maxlength: [64, "Password can't be greater than 64 characters"],
      match: [
        /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@[*[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+]*/,
        "Please provide a valid email address",
      ],
    },
    school: {
      type: String,
      required: [true, "School is required"],
      minlength: [3, "School can't be smaller than 3 characters"],
      maxlength: [64, "School can't be greater than 64 characters"],
    },
    role: {
      type: Number,
      default: 0,
    },
    date: {
      type: Date,
      default: new Date(),
    },
    resetPasswordToken: {
      type: String,
      default: "",
    },
    expireToken: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('Users',UserSchema);

module.exports = User;
