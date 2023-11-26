const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReplySchema = new Schema({
  replyId: { type: String, unique: true },
  beeId: { type: Schema.Types.ObjectId, ref: 'Bees'},
  honeycombId: { type: Schema.Types.ObjectId, ref: 'Honeycombs'},
  posts: { type: String, required: true, max: 500},
  media: [{type:String}],
  reply:[{ type: Schema.Types.ObjectId, ref:'Replys' }],
},
  {timestamps : true}
);

const Reply = mongoose.model('Replys',ReplySchema);

module.exports = Reply;