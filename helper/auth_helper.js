module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            next();
        }
        req.flash("ERROR_MESSAGE", "Sry Your not Authorized user");
        res.redirect("/auth/login", 302, {})
    },
};