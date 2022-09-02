const router = require("express").Router();
const {
    likePost,
    countPostLikes,
    deleteLikesFromPost,
} = require("../controller/like");

router.post("/likePost", likePost);
router.get("/countPostLikes", countPostLikes);
router.delete("/deleteLikesFromPost", deleteLikesFromPost);

module.exports = router;
