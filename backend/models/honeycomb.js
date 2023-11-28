const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HoneycombSchema = new Schema({
  _beeId: { type:Schema.Types.ObjectId, ref: 'Bees', required: true},
  _beehiveId: { type:Schema.Types.ObjectId, ref: 'Beehives', required: true},
  title: { type: String, required: true, max: 50 },
  posts: { type: String, required: true, max: 2000 },
  media: [{ type: String }],
  honey: [{ type: Schema.Types.ObjectId, ref: 'Bees'}],
  reply: [{ type: Schema.Types.ObjectId, ref: 'Replys'}],
},{
  timestamps:true
});

module.exports =  mongoose.model('Honeycombs', HoneycombSchema);