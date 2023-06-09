const express = require("express");
const routes = require("./routes/Route");
const cors = require("cors");
const app = express();
const path = require("path");
// const PORT = 80; // for server
const PORT = 4001; // for local
app.use(express.json());

app.use(cors());
require("./config/db");
app.use("/api", routes);
app.use("/uploads", express.static("uploads"));

app.get("/test", (req, res) => {
  res.status(200).json({
    message: "Server is online.",
  });
});

// app.use(express.static("build"));
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "build", "index.html"));
// });

app.listen(PORT, () => {
  console.log(`server started on ${PORT}`);
});
