var express = require("express");
var router = express.Router();
const nodemailer = require("nodemailer");
const config = require("../config.json");

router.get("/", (req, res, next) => {
    res.render("contact-me", { title: "My email" });
});

router.post("/", (req, res, next) => {
//требуем наличия имени, обратной почты и текста
    if (!req.body.name || !req.body.email || !req.body.message) {
        return res.json({
            msg: "Все поля нужно заполнить!",
            status: "Error"
        });
    }
//инициализируем модуль для отправки писем и указываем данные из конфига
    const transporter = nodemailer.createTransport(config.mail.smtp);
    const mailOptions = {
        from: config.mail.smtp.auth.user,
        to: `"${req.body.name}" <${req.body.email}>`,
        subject: config.mail.subject,
        text:
            req.body.message.trim().slice(0, 500) +
            `\n Отправлено с: <${req.body.email}>`
    };
//отправляем почту
    transporter.sendMail(mailOptions, function(error, info) {
//если есть ошибки при отправке - сообщаем об этом
        if (error) {
            return res.json({
                msg: `При отправке письма произошла ошибка!: ${error}`,
                status: "Error"
            });
        }
        res.json({
            mes: "Сообщение отправлено!",
            status: "OK"
        });
    });
});

module.exports = router;
