const express = require("express");
const bodyParsr = require("body-parser");
const morgan = require("morgan");
let app = express();

const api = require("./api/v1/endpoints");
const dbconn = require("./db");

//databse connection
dbconn();

//middlewares
app.use(bodyParsr.json());
app.use(bodyParsr.urlencoded({ extended: true }));
app.use(morgan("tiny"));

//Api endpoints
app.use("/", api);

app.listen(3000, () => {
  console.log("server is running at port 3000");
});
