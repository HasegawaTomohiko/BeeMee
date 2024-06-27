const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BeeSchema = new Schema({
  beeId: { type: String, required: true, max: 30, unique: true, },
  beeName : { type: String, max: 30 , required: true},
  description: { type: String, max: 300 },
  location: { type: String },
  customUrl: { type: String },
  beeIcon: { type: String },
  beeHeader: { type: String },
  follow: [{ type: Schema.Types.ObjectId,ref: 'Bees'}],
  followCount: { type: Number, default: 0 },
  follower: [{type: Schema.Types.ObjectId,ref: 'Bees'}],
  followerCount: { type: Number, default: 0 },
  joinBeehive: [{type: Schema.Types.ObjectId,ref: 'Beehives'}],
  joinBeehiveCount: { type: Number, default: 0},
  sendHoney: [{type: Schema.Types.ObjectId,ref: 'Honeycombs'}],
  sendHoneyCount: { type: Number, default: 0},
  block: [{type: Schema.Types.ObjectId,ref: 'Bees'}],
},{
  timestamps: false
});

const Bees = mongoose.model('Bees',BeeSchema);

module.exports = Bees;