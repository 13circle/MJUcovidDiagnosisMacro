const express = require("express");
const router = express.Router();

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
  res.send("/register - User registration");
});

router.delete("/unregister", (req, res, next) => {
  res.send("/unregister - User unregistration");
});

module.exports = router;
