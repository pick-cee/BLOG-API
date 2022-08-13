const router = require("express").Router();

const { blogPost, deletePost, getPost } = require("../controller/post");
const { verifyUserToken } = require("../lib/auth");

router.post("/post", verifyUserToken, blogPost);
router.delete("/deletePost", verifyUserToken, deletePost);
router.get("/getPost", verifyUserToken, getPost);

module.exports = router;
