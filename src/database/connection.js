const mysql = require("mysql2");

const db = mysql.createConnection({
    database: "project_base",
    host: "localhost",
    user: "root",
    password: "root123"
})

db.connect((err) => {
    if(err)
    {
        console.log("Error is there",err);
    }
    console.log("Database is connected");
})

// exports.login = (req, res) => {
    
// }

exports.profile = (req, res) => {
    res.render("./layouts/uidselection");
}

exports.userprofile = (req, res) => {
    const uid = req.body.uid;
    console.log(uid);
    db.query("select * from userbase where uid = ?", [uid], (err, result) => {
        if(err)
        {
            res.json(err);
        }
        else
        {
            console.log(result);
            res.render("./layouts/userhome", {result});
        }
    })
}