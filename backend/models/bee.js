const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BeeSchema = new Schema({
  beeId: { type: Schema.Types.ObjectId, required: true, max: 30, unique: true, },
  beeName : { type: String, max: 30 , required: true},
  description: { type: String, max: 300 },
  location: { type: String },
  customUrl: { type: String },
  beeIcon: { type: String },
  beeHeader: { type: String },
  follow: [{
    type: Schema.Types.ObjectId,
    ref: 'Bee',
  }],
  follower: [{
    type: Schema.Types.ObjectId,
    ref: 'Bee',
  }],
  joinBeehive: [{
    type: Schema.Types.ObjectId,
    ref: 'Beehive',
  }],
  sendHoney: [{
    type: Schema.Types.ObjectId,
    ref: 'Honeycomb',
  }],
  block: [{
    type: Schema.Types.ObjectId,
    ref: 'Bee',
  }]
},
  {timestamps: true}
);

module.exports = mongoose.model('Bee',BeeSchema);