const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  number: {
    type: String,
  },
  password: {
    type: String,
  },
  userId: {
    type: String,
  },
  area: {
    type: Array,
  },
});

const Agent = mongoose.model("Agent", agentSchema);

module.exports = Agent;
