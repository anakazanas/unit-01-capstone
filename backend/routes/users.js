const express = require("express");
const router = express.Router();
const usersCtrl = require("../controllers/users");
const verifyToken = require("../middleware/verifyToken");

router.post("/signup", usersCtrl.signup);
router.post("/login", usersCtrl.login);
router.get("/profile", verifyToken, usersCtrl.getProfile);
router.put("/profile", verifyToken, usersCtrl.updateProfile);
router.delete("/profile", verifyToken, usersCtrl.deleteAccount);

module.exports = router;