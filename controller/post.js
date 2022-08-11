const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");

const blogPost = async (request, response) => {
    try {
        const { post } = request.body;
        const userId = request.query.userId;
        const user = await User.findById(userId);
        if (!user) {
            response.status(400).send({ message: "User does not exists" });
        }
        const post1 = new Post({
            post: post,
            userId: userId,
        });
        await post1.save();
        response.status(200).json({ message: "Blog posted successfully" });
    } catch (error) {
        response
            .status(500)
            .json({ message: "Some error occured, try again later!" });
    }
};

const deletePost = async (request, response) => {
    try {
        const userId = request.query.userId;
        const { postId } = request.body;
        const user = await User.findById(userId);
        if (!user) {
            response.status(400).send({ message: "User does not exists" });
        }
        await Post.findByIdAndDelete(postId);
        await Comment.deleteMany({ postId: postId });
        response.status(200).json({
            message: "Post deleted successfully!",
        });
    } catch (err) {
        response
            .status(500)
            .json({ message: "Some error occured, try again later!" });
    }
};

const getPost = async (request, response) => {
    try {
        const userId = request.query.userId;
        const user = await User.findById(userId);
        if (!user) {
            response.status(400).send({ message: "User does not exists" });
        }
        const posts = await Post.find().populate("userId");
        response
            .status(200)
            .json({ message: "Posts fetched successfully", posts: posts });
    } catch (err) {
        response.status(500).json({
            message: "Some error occured, try again later!",
        });
    }
};

module.exports = {
    blogPost,
    deletePost,
    getPost,
};
