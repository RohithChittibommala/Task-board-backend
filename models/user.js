const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("email-validator");

// const SALT_WORK_FACTOR = 10;

const UserSchema = new Schema({
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    lowercase: true,
    validate: {
      validator: (email) => {
        if (!validator.validate(email))
          throw new Error("Please enter a valid E-mail!");
      },
    },
  },
  password: {
    trim: true,
    type: String,
    required: [true, "password is required"],
    minLength: [6, "password must be atleast 6 charcaters"],
  },
  name: {
    type: String,
    required: [true, "name is required"],
    minLength: [3, "name must be atleast 3 charcaters"],
  },
  state: {
    type: Schema.Types.Mixed,
    default: {
      user: {
        name: "",
      },
      lists: [],
      draggedItem: null,
    },
  },
  tokenVersion: {
    type: Number,
    default: 0,
  },

  verified: {
    type: Boolean,
    default: false,
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const user = this;
  user.password = await bcrypt.hash(user.password, 10);
  user.state.user.name = user.name;
  next();
});

UserSchema.methods.comparePassword = function (candidatePsd) {
  return bcrypt.compare(candidatePsd, this.password);
};

const User = new model("User", UserSchema);

module.exports.User = User;
