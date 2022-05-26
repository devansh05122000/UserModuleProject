const express = require("express");
const path = require("path");
const hbs = require("hbs");
const bodyparser = require("body-parser");
// require("./src/database/connection");

const app = express();

app.use(express.json());

const static_path = path.join(__dirname, "./public")
console.log(static_path);
app.use(express.static(static_path))
const partials_path = path.join(__dirname, "./views/partials")
hbs.registerPartials(partials_path)

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}))

app.set("content-type", "application/json");
app.set("view engine", "hbs");

const routes = require("./src/model/controller");
app.use('/', routes);



// app.get("/", (req, res) => {
//     res.json("hi this is running");
// })

app.listen(5001, () => {
    console.log("server is running on 5001");
})