const router = require("express").Router();

const { blogPost, deletePost, getPost } = require("../controller/post");

router.post("/post", blogPost);
router.delete("/deletePost", deletePost);
router.get("/getPost", getPost);

module.exports = router;
