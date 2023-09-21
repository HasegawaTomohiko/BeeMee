const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HoneycombSchema = new Schema({
  honeycombid: { type: String, required: true, max: 30, unique: true },
  beeid: { type:Schema.Types.ObjectId, ref: 'Bee'},
  beehiveid: { type:Schema.Types.ObjectId, ref: 'Beehive'},
  title: { type: String, required: true, max: 50 },
  posts: { type: String, max: 500 },
  mediaPath: [{ type: String }],
  honey: [{ type: Schema.Types.ObjectId, ref: 'Bee'}],
  replies: [
    {
      beeid: { type: Schema.types.ObjectId, ref: 'Bee'},
      reply: { type: String }
    },
  ],
});

const Honeycomb = mongoose.model('Honeycomb', HoneycombSchema);

module.exports = Honeycomb;