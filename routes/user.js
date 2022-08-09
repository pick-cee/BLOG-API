const router = require("express").Router();
const { register, verifyEmail } = require("../controller/user");
const { verifyUserToken } = require("../lib/auth");

router.post("/register", register);
router.post("/verifyEmail", verifyEmail);

module.exports = router;
