const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BeehiveSchema = new Schema({
  beehiveId: { type:String, unique:true, required:true, max: 30},
  beehiveName: { type:String, max:50, required: true},
  description: { type:String, max:500},
  beehiveIcon: { type:String },
  beehiveHeader: { type:String },
  queenBee: [{ type:Schema.Types.ObjectId, ref:'Bees'}],
  joinedBee: [{ type:Schema.Types.ObjectId, ref:'Bees'}],
  blockBee: [{type:Schema.Types.ObjectId, ref:'Bees'}]
},{
  timestamps: false,
});

module.exports = mongoose.model('Beehives',BeehiveSchema);
