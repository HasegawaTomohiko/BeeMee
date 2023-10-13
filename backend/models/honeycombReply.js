const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HoneycombReplySchema = new Schema({
  replyId: { type: String, unique: true },
  beeId: { type: Schema.Types.ObjectId, ref: 'Bee'},
  honeycombId: { type: Schema.Types.ObjectId, ref: 'Honeycomb'},
  posts: { type: String, max: 500},
  reply:[{ type: Schema.Types.ObjectId, ref:'HoneycombReply' }],
},
  {timestamps : true}
);

const HoneycombReply = mongoose.model('HoneycombReply',HoneycombReplySchema);

module.exports = HoneycombReply;