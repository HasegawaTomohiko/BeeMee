const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HoneycombSchema = new Schema({
  honeycombId: { type: String, required: true, unique: true },
  beeId: { type:Schema.Types.ObjectId, ref: 'Bee'},
  beehiveId: { type:Schema.Types.ObjectId, ref: 'Beehive'},
  title: { type: String, required: true, max: 50 },
  posts: { type: String, max: 500 },
  mediaPath: [{ type: String }],
  honey: [{ type: Schema.Types.ObjectId, ref: 'Bee'}],
  reply: [{ type: Schema.Types.ObjectId, ref: 'HoneycombReply'}],
},
  {timestamps:true}
);

const Honeycomb = mongoose.model('Honeycomb', HoneycombSchema);

module.exports = Honeycomb;