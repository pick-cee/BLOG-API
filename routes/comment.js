const router = require("express").Router();
const {
    commentPost,
    getComment,
    deleteComment,
} = require("../controller/comment");

const { verifyUserToken } = require("../lib/auth");

router.post("/commentPost", verifyUserToken, commentPost);
router.get("/getComment", verifyUserToken, getComment);
router.delete("/deleteComment", verifyUserToken, deleteComment);

module.exports = router;
