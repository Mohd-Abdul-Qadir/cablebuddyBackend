const mongoose = require("mongoose");

const DB =
  "mongodb+srv://abdul:raylancer12345@cluster0.xav0n1e.mongodb.net/test";

mongoose
  .connect(DB, {})
  .then(() => {
    console.log("connection sucussfull");
  })
  .catch((err) => {
    console.log("no connection", err);
  });
