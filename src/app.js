const express = require("express");
const app = express();
var cors = require("cors");
var path = require("path");

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../public")))

var connectRouter = require("./routes/connect");

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "login.html"));
});
app.use("/connect", connectRouter);

app.listen(3000, () => {
  console.log(`Aplicação rodando nesse caminho http://localhost:3000`);
});