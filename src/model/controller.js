const express = require("express");
const router = express.Router();
const connection = require("../database/connection");

router.get("/", connection.login);
router.post("/home", connection.auth);
router.get("/userhome/:uid", connection.profile);
// router.post("/postprofile", connection.userprofile);
router.get("/adminhome/:uid", connection.adminhome);
// router.post("/adminprofile", connection.adminprofile);
router.get("/employees", connection.team);
router.get("/projects", connection.projects);
router.get("/adduser", connection.adduser);
router.post("/adduser", connection.postuseradd);
router.get("/addproj", connection.addproj);
router.post("/addproj", connection.postprojadd);
router.get("/edituser/:uid", connection.edit);
router.post("/edituser/:uid", connection.update);
router.get("/editproj/:pid", connection.editproj);
router.post("/editproj/:pid", connection.updateproj);
router.get("/delete/:uid", connection.delete);
router.get("/deleteproj/:pid", connection.deleteproj);
router.get("/logout", connection.logout);
module.exports = router;