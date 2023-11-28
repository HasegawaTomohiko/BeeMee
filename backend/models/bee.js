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
  follower: [{type: Schema.Types.ObjectId,ref: 'Bees'}],
  joinBeehive: [{type: Schema.Types.ObjectId,ref: 'Beehives'}],
  sendHoney: [{type: Schema.Types.ObjectId,ref: 'Honeycombs'}],
  block: [{type: Schema.Types.ObjectId,ref: 'Bees'}]
},{
  timestamps: false
});

module.exports = mongoose.model('Bees',BeeSchema);