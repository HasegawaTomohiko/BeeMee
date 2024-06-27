const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReplySchema = new Schema({
  _beeId: { type: Schema.Types.ObjectId, ref: 'Bees'},
  _honeycombId: { type: Schema.Types.ObjectId, ref: 'Honeycombs'},
  posts: { type: String, required: true, max: 2000},
  media: [{type:String}]
},
  {timestamps : true}
);

const Replys = mongoose.model('Replys',ReplySchema);

module.exports = Replys;