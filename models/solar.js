const mongoose = require("mongoose")

const solarSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.ObjectId
  },
  voltage: [Number],
  current: [Number],
  power: [Number],
}, {timestamps: true})

module.exports = mongoose.model("Solar", solarSchema)