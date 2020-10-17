const Photo = require("../models/photo")
const Album = require("../models/album")


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();
}


