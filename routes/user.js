const router = require("express").Router();
const { register, verifyEmail, resendToken } = require("../controller/user");
const { verifyUserToken } = require("../lib/auth");

router.post("/register", register);
router.post("/verifyEmail", verifyEmail);
router.post("/resendToken", resendToken);

module.exports = router;
