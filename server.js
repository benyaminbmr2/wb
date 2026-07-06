const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(cors());

app.get("/clans", (req, res) => {

try {


const data = fs.readFileSync(
  "clans.json",
  "utf8"
);

res.json(JSON.parse(data));


} catch (error) {


res.status(500).json({
  error: error.message
});


}

});

app.listen(3000, () => {
console.log("Server running on port 3000");
});
