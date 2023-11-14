const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BeehiveSchema = new Schema({
  beehiveid: { type:String, unique:true, required:true, max: 30},
  beehiveName: { type:String, max:50, required: true},
  description: { type:String, max:500},
  beehiveIcon: { type:String },
  beehiveHeader: { type:String },
  queenBee: [{ type:Schema.Types.ObjectId, ref:'Bee'}],
  joinedBee: [{ type:Schema.Types.ObjectId, ref:'Bee'}],
  blockBee: [{type:Schema.Types.ObjectId, ref:'Bee'}]
});

module.exports = mongoose.model('Beehive',BeehiveSchema);
