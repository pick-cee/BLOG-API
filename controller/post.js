const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");

const blogPost = async (request, response) => {
    try {
        const { post } = request.body;
        const userId = request.query.userId;
        const user = await User.findById(userId);
        if (!user) {
            return response
                .status(400)
                .send({ message: "User does not exists" });
        }
        const post1 = new Post({
            post: post,
            userId: userId,
        });
        await post1.save();
        return response
            .status(200)
            .json({ message: "Blog posted successfully" });
    } catch (error) {
        return response
            .status(500)
            .json({ message: "Some error occured, try again later!" });
    }
};

const deletePost = async (request, response) => {
    try {
        const userId = request.query.userId;
        const postId = request.query.postId;
        const user = await User.findById(userId);
        const post = await Post.findById(postId);
        if (!user) {
            return response
                .status(400)
                .send({ message: "User does not exists" });
        }
        if (!post) {
            return response
                .status(400)
                .send({ message: "Post does not exists" });
        }
        await Post.findByIdAndDelete(postId);
        await Comment.deleteMany({ postId: postId });
        return response.status(200).json({
            message: "Post deleted successfully!",
        });
    } catch (err) {
        return response
            .status(500)
            .json({ message: "Some error occured, try again later!" });
    }
};

const getPost = async (request, response) => {
    try {
        const userId = request.query.userId;
        const user = await User.findById(userId);
        if (!user) {
            return response
                .status(400)
                .send({ message: "User does not exists" });
        }
        const posts = await Post.find().populate("userId").select("-password");
        return response
            .status(200)
            .json({ message: "Posts fetched successfully", posts: posts });
    } catch (err) {
        return response.status(500).json({
            message: "Some error occured, try again later!",
        });
    }
};

module.exports = {
    blogPost,
    deletePost,
    getPost,
};
