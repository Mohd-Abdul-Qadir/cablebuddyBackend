const express = require("express");
const routes = require("./routes/Route");
const cors = require("cors");
const app = express();
const PORT = 4001;
app.use(express.json());

app.use(cors());
require("./config/db");
app.use("/api", routes);

app.use(express.static(path.join(__dirname, "./cablebuddy/build")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "./cablebuddy/index.html"));
});

app.listen(PORT, () => {
  console.log(`server started on ${PORT}`);
});
