const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MySQLSessionStorage = require("express-mysql-session")(session);
const logger = require("morgan");

const dbConfig = require("@config/database");

const indexRouter = require("@routes/index");
const usersRouter = require("@routes/users");
const utilsRouter = require("@routes/utils");

const app = express();

require("dotenv").config(require("@config/dotenvConfig"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  session({
    key: "mju_covid_diagnosis_macro_session_key",
    secret: process.env.SESSION_SECRET,
    store: new MySQLSessionStorage(dbConfig),
    resave: false,
    saveUninitialized: true,
  })
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/utils", utilsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

//

/*
const dbConfig = require("./config/database");
const macro = require("./macro");

const connection = mysql.createConnection(dbConfig);
const publicDir = (src) => path.join(__dirname + "/public/" + src);

const rootURL = "http://18.217.240.122:51122/";
const updateHr = 5;

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));

const dateDiff = (date1, date2) => {
  return parseInt((date2.getTime() - date1.getTime()) / (1000 * 3600 * 24));
};

app.get("/", (req, res) => {
  res.sendFile(publicDir("index.html"));
});

setInterval(
  (function updateDiagnosis() {
    let dateObj = new Date(),
      tDateObj;
    let hr = dateObj.getHours();
    if (hr == updateHr) {
      let sql = "SELECT * FROM UserInfo";
      connection.query(sql, (err, rows, fields) => {
        if (err) throw err;
        for (let i = 0; i < rows.length; i++) {
          macro.fillDiagnosis(
            rows[i].stud_id.toString(),
            rows[i].pw,
            rows[i].email,
            rows[i].last_classdate
          );
          if (dateDiff(dateObj, new Date(rows[i].last_classdate)) < 0) {
            sql = "DELETE FROM UserInfo WHERE stud_id=?";
            let params = [rows[i].stud_id];
            connection.query(sql, params, (err, rows, fields) => {
              if (err) throw err;
            });
          }
        }
      });
    }
    return updateDiagnosis;
  })(),
  3600000
);

app.post("/registration", (req, res) => {
  let r = req.body;
  let params = [r.stud_id, r.pw, r.email, r.last_classdate];
  let sql = "INSERT INTO UserInfo VALUES(?,?,?,?)";
  connection.query(sql, params, (err, rows, fields) => {
    if (err) throw err;
    res.redirect(rootURL + "?registration_successful");
  });
});

app.post("/login", (req, res) => {
  let r = req.body;
  let params = [r.stud_id, r.pw];
  let sql = "SELECT * FROM UserInfo WHERE stud_id = ? AND pw = ?";
  connection.query(sql, params, (err, rows, fields) => {
    if (err) throw err;
    if (rows.length > 0) res.redirect(rootURL + "?login_successful");
    else {
      res.send(
        "<h3>로그인 실패. 학번과 비밀번호를 다시 확인하세요.</h3>" +
          `<a href="${rootURL}">돌아가기</a>`
      );
    }
  });
});

app.listen(51122, () => console.log("Server Running..."));
*/
