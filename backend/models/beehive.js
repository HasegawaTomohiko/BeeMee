const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BeehiveSchema = new Schema({
  beehiveid: { type:String, unique:true, max: 30},
  beehiveName: { type:String, max:30},
  description: { type:String, max:150},
  beehiveIcon: { type:String },
  beehiveHeader: { type:String },
  queenBee: [{ type:Schema.Types.ObjectId, ref:'Bee'}],
  joinedBee: [{ type:Schema.Types.ObjectId, ref:'Bee'}],
},
  {timestamps: true}
);

const Beehive = mongoose.model('Beehive',BeehiveSchema);

module.exports = Beehive;