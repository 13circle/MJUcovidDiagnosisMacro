require("dotenv").config(require("@config/dotenvConfig"));

exports.transporter = {
  service: process.env.MAILER_SERVICE,
  host: process.env.MAILER_HOST,
  port: process.env.MAILER_PORT,
  secure: process.env.MAILER_SECURE === "SECURE",
  requireTLS: process.env.MAILER_REQUIRE_TLS === "REQUIRE",
  auth: {
    user: process.env.MAILER_USER_EMAIL,
    pass: process.env.MAILER_USER_PASSWORD,
  },
};
