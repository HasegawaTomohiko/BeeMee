const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HoneycombSchema = new Schema({
  honeycombId: { type: String, required: true, unique: true },
  beeId: { type:Schema.Types.ObjectId, ref: 'Bees', required: true},
  beehiveId: { type:Schema.Types.ObjectId, ref: 'Beehives', required: true},
  title: { type: String, required: true, max: 50 },
  posts: { type: String, required: true, max: 500 },
  media: [{ type: String }],
  honey: [{ type: Schema.Types.ObjectId, ref: 'Bees'}],
  reply: [{ type: Schema.Types.ObjectId, ref: 'Replys'}],
},
  {timestamps:true}
);

const Honeycomb = mongoose.model('Honeycombs', HoneycombSchema);

module.exports = Honeycomb;