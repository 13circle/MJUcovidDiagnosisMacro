const express = require("express");
const Joi = require("joi");
const mysql = require("mysql");
const dbConfig = require("@config/database");
const pwcrypto = require("@utils/pwcrypto");
const router = express.Router();

const dbConn = mysql.createConnection(dbConfig);
dbConn.connect();

router.get("/check", (req, res, next) => {
  res.send("/check - Check whether the user is logged in");
});

router.post("/login", (req, res, next) => {
  res.send("/login - User login");
});

router.patch("/edit", (req, res, next) => {
  res.send("/edit - Edit user information");
});

router.post("/register", (req, res, next) => {
  const schema = Joi.object().keys({
    stud_id: Joi.string().length(8).required(),
    stud_pw: Joi.string().max(15).required(),
    stud_name: Joi.string().required(),
    email: Joi.string().email().required(),
    send_mail: Joi.string().length(1),
  });
  const result = schema.validate(req.body);
  if (result.error) {
    res.status(400).send(result.error);
    return;
  }

  const { stud_id, stud_pw, stud_name, email, send_mail } = req.body;
  const sqlChk = "SELECT * FROM User WHERE stud_id = ? OR email = ?";
  dbConn.query(sqlChk, [stud_id, email], (err, rows, fields) => {
    if (err) {
      res.status(500).send({ success: false, errmsg: err });
      return;
    }

    if (rows.length > 0) {
      res.status(400).send({
        success: false,
        errmsg: "학번 또는 이메일이 이미 존재합니다.",
      });
      return;
    } else {
      const sqlReg = "INSERT INTO User VALUES (?, ?, ?, ?, ?, ?)";
      dbConn.query(
        sqlReg,
        [
          stud_id,
          pwcrypto.encrypt(stud_pw),
          stud_name,
          email,
          send_mail,
          new Date().getTime(),
        ],
        (err, results) => {
          if (err) {
            res.status(500).send({ success: false, errmsg: err });
            return;
          }

          res.send({ success: true, errmsg: null });
        }
      );
    }
  });
});

router.delete("/unregister", (req, res, next) => {
  res.send("/unregister - User unregistration");
});

module.exports = router;
