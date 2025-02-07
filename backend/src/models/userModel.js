const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  nic: { type: String, required: true, unique: true },
  fullName: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  contactNumber: { type: String, required: false },
  address: { type: String, required: false },
  birthdate: { type: Date, required: false },
  age: { type: Number, required: false },
  bloodGroup: { type: String, required: false },
  avatar: { type: String, required: false },
});

module.exports = mongoose.model("User", UserSchema);
