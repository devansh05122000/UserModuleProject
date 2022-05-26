const express = require("express");
const router = express.Router();
const connection = require("../database/connection");

router.get("/userhome", connection.profile);
router.post("/postprofile", connection.userprofile);

module.exports = router;