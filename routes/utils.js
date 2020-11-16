const express = require("express");
const router = express.Router();

router.post("/sendmail", (req, res, next) => {
  res.send("/sendmail - Send diagnosis result image to the client by email");
});

module.exports = router;
