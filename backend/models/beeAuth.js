const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BeeAuthSchema = new Schema({
  beeId: { type: String, max: 30, unique: true},
  password: { type: String, max: 100 },
  salt: { type: String, max: 100 },
  email: { type: String, max:50 }
});

const BeeAuth = mongoose.model("BeeAuth",BeeAuthSchema);

module.exports = BeeAuth;

