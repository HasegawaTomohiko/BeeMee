const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReplySchema = new Schema({
  replyId: { type: String, unique: true },
  beeId: { type: Schema.Types.ObjectId, ref: 'Bee'},
  honeycombId: { type: Schema.Types.ObjectId, ref: 'Honeycomb'},
  posts: { type: String, required: true, max: 500},
  media: [{type:String}],
  reply:[{ type: Schema.Types.ObjectId, ref:'Reply' }],
},
  {timestamps : true}
);

const Reply = mongoose.model('Reply',ReplySchema);

module.exports = Reply;