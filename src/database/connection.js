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
    res.render("./layouts/login");
}

exports.auth = (req, res) => {
    const {id, email, password} = req.body;
    console.log(id, email, password);
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

exports.adminhome = (req, res) => {
    // res.render("./layouts/adminhome");
    if(req.session.user){
    const aid = 3;
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
    db.query("select * from userbase where role != 'admin' and isactive = 'yes'", (err, rows) => {
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

exports.adduser = (req, res) => {

    res.render("./layouts/adduserform");
}

exports.postuseradd = (req, res) => {
    const {id, name, email, address, phone, role, isactive} = req.body;
    db.query("insert into userbase values(?,?,?,?,?,?,?)", [id,name,role,email,address,phone,isactive], (err, code) => {
        if(err)
        {
            res.json(err);
        }
        else{
            res.render("./layouts/adduserform", { alert: "User Added Successfully"});
        }
    })
}

exports.edit = (req, res) => {
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

exports.addproj = (req, res) => {
    res.render("./layouts/addprojform");
}

exports.postprojadd = (req, res) => {
    const {pid, projname, name, description, technology, projrole, timelines, isactive} = req.body;
    db.query("insert into projectview values(?,?,?,?,?,?,?,?)", [pid, projname, name, description, technology, projrole, timelines, isactive], (err, code) => {
        if(err)
        {
            res.json(err);
        }
        else{
            res.render("./layouts/addprojform", { alert: "User Added Successfully"});
        }
    })
}

exports.editproj = (req, res) => {
    db.query('select * from projectview where pid = ?', [req.params.pid], (err, rows) => {
        if (!err) {
          res.render('./layouts/edit-proj', { rows });
        } else {
          console.log(err);
        }
        console.log('The data from project table: \n', rows);
      });
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
    // res.redirect("/postprofile/")
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
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/');
    });
};