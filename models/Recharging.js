const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const RechargingSchema = new Schema({  
  user:{
    type: String,
    index:true
  },  

  money:{
    type:Number,
    index:true
  },
  email:{
    type:String
  },
  productinfo:{
    type: String,
    index:true
  },
  recharge:{
    type: String,
    index:true
  },
  order:{
    type:String
  },
  status:{
    type:Number
  },
  createdAt: { type: Date, required: true, default: Date.now, expires: 43200 }
  
});

module.exports = Recharging = mongoose.model("recharging", RechargingSchema);
