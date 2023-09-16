const express = require("express");
const morgan = require("morgan");
let app = express();

app.use(morgan("tiny"));

app.listen(3000, () => {
  console.log("server is running at port 3000");
});
