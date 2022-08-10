const router = require("express").Router();
const {
    register,
    verifyEmail,
    resendToken,
    login,
    forgotPassword,
    resetPassword,
} = require("../controller/user");
const { verifyUserToken } = require("../lib/auth");

router.post("/register", register);
router.post("/verifyEmail", verifyEmail);
router.post("/resendToken", resendToken);
router.post("/login", login);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", resetPassword);

module.exports = router;
