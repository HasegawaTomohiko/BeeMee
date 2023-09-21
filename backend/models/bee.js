const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BeeSchema = new Schema({
  beeid: { type: String, required: true, max: 30, unique: true, },
  email: { type: String, required: true, max: 50, },
  description: { type: String, max: 160 },
  location: { type: String, max: 20 },
  customUrl: { type: String, max:50 },
  profileIcon: { type: String },
  profileHeader: { type: String },
  follow: [{
    type: Schema.Types.ObjectId,
    ref: 'Bee',
  }],
  followers: [{
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

const Bee = mongoose.model('Bee',BeeSchema);

module.exports = Bee;