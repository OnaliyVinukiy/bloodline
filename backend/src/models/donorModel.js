const mongoose = require("mongoose");

const DonorSchema = new mongoose.Schema({
  nic: String,
  fullName: String,
  email: { type: String, required: true, unique: true },
  contactNumber: String,
  address: String,
  birthdate: String,
  age: Number,
  bloodGroup: String,
  avatar: String,
});

module.exports = mongoose.model("Donor", DonorSchema);
