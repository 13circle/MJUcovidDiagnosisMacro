const schedule = require("node-schedule");
const mysql = require("mysql");
const dbConfig = require("@config/database");

const dbConn = mysql.createConnection(dbConfig);
dbConn.connect();

exports.addRule = (stud_id, day_of_week, hour, minute, onSuccess, onError) => {
  dbConn.query(
    "INSERT INTO MailRule(stud_id, day_of_week, hour, minute) VALUES (?, ?, ?, ?)",
    [stud_id, day_of_week, hour, minute],
    (err, results) => {
      if (err) {
        onError(err);
        return;
      }

      dbConn.query(
        "SELECT MAX(rule_no) AS max_rule_no FROM MailRule WHERE stud_id = ?",
        [stud_id],
        (err, rows, fields) => {
          if (err) {
            onError(err);
            return;
          }

          schedule.scheduleJob(
            `${stud_id}-${rows[0].max_rule_no}`,
            `${minute} ${hour} * * ${day_of_week === -1 ? "*" : day_of_week}`,
            onSuccess
          );
        }
      );
    }
  );
};

exports.getRules = (stud_id) => {
  const rules = schedule.scheduledJobs;
  const my_rules = {};
  for (let rule_name in rules) {
    if (rule_name.indexOf(`${stud_id}-`) !== -1) {
      my_rules[rule_name] = rules[rule_name];
    }
  }
  return my_rules;
};

exports.deleteRule = (rule_name, onSuccess, onError) => {
  const rule_no = parseInt(new String(rule_name).split("-").pop());

  dbConn.query(
    "DELETE FROM MailRule WHERE rule_no = ?",
    [rule_no],
    (err, results) => {
      if (err) {
        onError(err);
        return;
      }

      schedule.cancelJob(rule_name);
      onSuccess();
    }
  );
};
