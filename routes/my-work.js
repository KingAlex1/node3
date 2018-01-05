
const express = require("express");
const router = express.Router();
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const db = require("../models/db");

router.get("/", (req, res, next) => {
    const works = db.getState().works;
    res.render("my-work", {
        isAuthorized: req.session.isAuthorized,
        works: works
    });
});
router.post("/", (req, res, next) => {
    const form = new formidable.IncomingForm();
    let upload = "public/upload";
    let fileName;
    if (!fs.existsSync(upload)) {
        fs.mkdirSync(upload);
    }
    form.uploadDir = path.join(process.cwd(), upload);
    form.parse(req, (err, fields, files) => {
        if (err) {
            return next(err);
        }
        const { projectName, projectUrl, text } = fields;
        let responseError = verifyForm(projectName, projectUrl, text);
        if (responseError) {
            res.send(responseError);
        }
        if (files.file.name === "" || files.file.size === 0) {
            return res.send({
                mes: "Не загружена картинка проекта",
                status: "Error"
            });
        }
        fileName = path.join(upload, files.file.name);
        fs.rename(files.file.path, fileName, function(err) {
            if (err) {
                console.error(err);
                fs.unlink(fileName);
                fs.rename(files.file.path, fileName);
            }
            let dir = fileName.substr(fileName.indexOf("\\"));
            db
                .get("works")
                .push({ projectName, projectUrl, text, dir })
                .write();
            res.send({
                mes: "Проект успешно загружен",
                status: "OK"
            });
        });
    });
});

module.exports = router;

function verifyForm(projectName, projectUrl, text) {
    let response;
    if (projectName === "") {
        response = {
            mes: "Не загружена название проекта",
            status: "Error"
        };
    }
    if (projectUrl === "") {
        response = {
            mes: "Не загружена url адрес проекта",
            status: "Error"
        };
    }
    if (text === "") {
        response = {
            mes: "Не загруженo описание проекта",
            status: "Error"
        };
    }
    return response;
}
