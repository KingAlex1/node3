var express = require("express");
var router = express.Router();
const db = require("../models/db");

router.get("/", (req, res, next) => {
    res.render("login");
});
router.post("/", (req, res, next) => {
    const { login, password } = req.body;
    const user = db.getState().user;
    if (user.login === login && user.password === password) {
        req.session.isAuthorized = true;
        res.send({
            mes: "Aвторизация успешна!",
            status: "OK"
        });
    } else {
        res.send({
            mes: "Логин и/или пароль введены неверно!",
            status: "Error"
        });
    }
});

module.exports = router;
