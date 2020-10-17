const express  = require("express");
const router = express.Router()

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/classes", (req, res) => {
    res.render("classes");
});

router.get("/contact", (req, res) => {
    res.render("contact");
});

router.get("/mavis", (req, res) => {
    res.render("mavis");
});


module.exports = router
