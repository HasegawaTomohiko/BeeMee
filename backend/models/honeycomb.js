const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HoneycombSchema = new Schema({
  honeycombId: { type: String, required: true, unique: true },
  beeId: { type:Schema.Types.ObjectId, ref: 'Bee', required: true},
  beehiveId: { type:Schema.Types.ObjectId, ref: 'Beehive', required: true},
  title: { type: String, required: true, max: 50 },
  posts: { type: String, required: true, max: 500 },
  media: [{ type: String }],
  honey: [{ type: Schema.Types.ObjectId, ref: 'Bee'}],
  reply: [{ type: Schema.Types.ObjectId, ref: 'Reply'}],
},
  {timestamps:true}
);

const Honeycomb = mongoose.model('Honeycomb', HoneycombSchema);

module.exports = Honeycomb;