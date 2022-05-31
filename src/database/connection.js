const session = require("express-session");
const mysql = require("mysql2");
// var sess;

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

exports.login = (req, res) => {
    if(!req.session.user){
    console.log("login function");
    res.render("./layouts/login");
    }
    else{
        res.render("./layouts/employees");
    }
}

exports.signup = (req, res) => {
    res.render("./layouts/signup");
}

exports.postsignup = (req, res) => {
    const {fname, femail, faddress, fphone, fpass} = req.body;
    db.query("insert into userbase (name, email, address, contact, password) values(?,?,?,?,?)", [fname, femail, faddress, fphone, fpass], (err, result) => {
        if(err)
        {
            console.log(err);
            res.json("person already exists!");
        }
        else{
            res.render("./layouts/login", {alert: "Signup Successfull, Please Login with your Credentials!"});
        }
    })
}

exports.auth = (req, res) => {
    const {id, email, password} = req.body;
    console.log("authoriosation");
    console.log(id, email, password);
    if(id != "" && email != "" && password != "")
    {
    db.query("select * from userbase where uid = ?", [id], (err, result) => {
        console.log("hello", result);
        const element = result.find(result => result.uid == id);
        console.log(element.role);
        if(id == element.uid && email == element.email && password == element.password && element.role == "Admin")
        {
            req.session.user = email;
            console.log('/adminhome/'+id);
            res.redirect('/adminhome/'+id);
        }
        else if(id == element.uid && email == element.email && password == element.password && element.role != "Admin")
        {
            req.session.user = email;
            console.log('/userhome/'+id);
            res.redirect('/userhome/'+id);
        }
        else{
            // res.end("Incorrect Email and Password");
            res.render("./layouts/login", {alert: "Invalid credentials!"});
        }
    })
}
else{
    res.render("./layouts/login", {alert: "Invalid credentials!"});
}
}

exports.adminhome = (req, res) => {
    // res.render("./layouts/adminhome");
    console.log("req.session.user", req.session.user);
    if(req.session.user){
    const aid = req.params.uid;
    console.log(aid);
    db.query("select * from userbase where uid = ?", [aid], (err, result) => {
        if(err)
        {
            res.json(err);
        }
        else
        {
            console.log(result);
            res.render("./layouts/adminhome", {result});
        }
    })
}
else{
    res.end("Please Login First");
    // res.redirect("/");
}
}

// exports.adminprofile = (req, res) => {
//     // const aid = req.body.aid;
//     const aid = 3;
//     console.log(aid);
//     db.query("select * from userbase where uid = ?", [aid], (err, result) => {
//         if(err)
//         {
//             res.json(err);
//         }
//         else
//         {
//             console.log(result);
//             res.render("./layouts/adminhome", {result});
//         }
//     })
// }

exports.team = (req, res) => {
    if(req.session.user)
    {
    db.query("select * from userbase where isactive = 'yes'", (err, rows) => {
        if(err)
        {
            res.json(err);
        }
        else{
            console.log(rows);
            res.render("./layouts/employees", {rows});
        }
    })
    }
    else{
        res.end("please login first");
    }
}

exports.adduser = (req, res) => {
    if(req.session.user){
        res.render("./layouts/adduserform");
    }
    else{
        res.end("please login first");
    }
}

exports.postuseradd = (req, res) => {
    const {name, email, address, phone, role, isactive, password} = req.body;
    db.query("insert into userbase(name, role, email, address, contact, isactive, password) values(?,?,?,?,?,?,?)", [name,role,email,address,phone,isactive,password], (err, code) => {
        if(err)
        {
            res.json("User With Same Credentials Already There!");
        }
        else{
            res.render("./layouts/adduserform", { alert: "User Added Successfully"});
        }
    })
}

exports.edit = (req, res) => {
    if(req.session.user){
    console.log(req.params.uid);
    db.query('select * from userbase where uid = ?', [req.params.uid], (err, rows) => {
      if (!err) {
        res.render('./layouts/edit-user', { rows });
      } else {
        console.log(err);
      }
      console.log('The data from user table: \n', rows);
    });
    }
    else{
        res.end("please login first");
    }
  }

  exports.update = (req, res) => {
    const { name,email,address,phone,role,isactive} = req.body;
    console.log(req.body);
    const sql = "UPDATE userbase SET name=?, email = ?, address = ?, contact = ?, role =?, isactive=? where uid = ?"
    db.query(sql, [name, email,address,phone,role,isactive, req.params.uid], (err, rows) => {
  
      if (!err) {
        res.render('./layouts/edit-user', { rows, alert: `${name} has been updated.` });
        
      } else {
        console.log(err);
      }
      console.log('The data from user table: \n', rows);
    });
  }

  exports.delete = (req, res) => {
    
      db.query('UPDATE userbase SET isactive = ? WHERE uid = ?', ['no', req.params.uid], (err, rows) => {
        if (!err) {
          res.redirect('/employees');
        } else {
          console.log(err);
        }
      })};

exports.projects = (req, res) => {
    if(req.session.user){
    db.query("select * from projectview where isactive='yes'", (err, ans) => {
        if(err)
        {
            res.json(err);
        }
        else{
            console.log(ans);
            res.render("./layouts/projects", {ans});
        }
    })
}
else{
    res.end("please login First!");
}
}

exports.addproj = (req, res) => {
    if(req.session.user){
        res.render("./layouts/addprojform");
    }
    else{
        res.end("please login first");
    }
}

exports.postprojadd = (req, res) => {
    const {pid, projname, name, description, technology, projrole, timelines, isactive} = req.body;
    db.query("insert into projectview values(?,?,?,?,?,?,?,?)", [pid, projname, name, description, technology, projrole, timelines, isactive], (err, code) => {
        if(err)
        {
            res.json("Project with same id already exixts!");
        }
        else{
            res.render("./layouts/addprojform", { alert: "User Added Successfully"});
        }
    })
}

exports.editproj = (req, res) => {
    if(req.session.user){
    db.query('select * from projectview where pid = ?', [req.params.pid], (err, rows) => {
        if (!err) {
          res.render('./layouts/edit-proj', { rows });
        } else {
          console.log(err);
        }
        console.log('The data from project table: \n', rows);
      });
    }
    else{
        res.end("please login first");
    }
}

exports.updateproj = (req, res) => {
    const { name,projname,description,technology,projrole,timelines} = req.body;
    console.log(req.body);
    const sql = "UPDATE projectview SET name=?, projname = ?, description = ?, technology = ?, projrole =?, timelines=? where pid = ?"
    db.query(sql, [name,projname,description,technology,projrole,timelines, req.params.pid], (err, rows) => {
  
      if (!err) {
        res.render('./layouts/edit-proj', { rows, alert: `${projname} has been updated.` });
        
      } else {
        console.log(err);
      }
      console.log('The data from project table: \n', rows);
    });
}

exports.deleteproj = (req, res) => {
    db.query('UPDATE projectview SET isactive = ? WHERE pid = ?', ['no', req.params.pid], (err, rows) => {
        if (!err) {
          res.redirect('/projects');
        } else {
          console.log(err);
        }
      })
}

exports.profile = (req, res) => {
    if(req.session.user){
    // res.render("./layouts/uidselection");
    const uid = req.params.uid;
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

    // res.redirect("/postprofile/")
    else{
        res.end("please login first");
    }
}

// exports.userprofile = (req, res) => {
//     const uid = req.body.uid;
//     console.log(uid);
//     db.query("select * from userbase where uid = ?", [uid], (err, result) => {
//         if(err)
//         {
//             res.json(err);
//         }
//         else
//         {
//             console.log(result);
//             res.render("./layouts/userhome", {result});
//         }
//     })
// }

exports.logout = (req,res) => {
    console.log("logout --->>>>", req.session);
    // req.session.destroy((err) => {
    //     if(err) {
    //         return console.log(err);
    //     }
    //     res.redirect('/');
    // });
req.session.destroy(err => {
  if (err) {
    res.status(400).send('Unable to log out')
  } else {
      console.log("logout -->>", req.session);
    res.send('Logout successful');
    // res.redirect('/');
  }
});


};