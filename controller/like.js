const User = require("../models/user");
const Post = require("../models/post");
const Like = require("../models/like");

// done - this controller enables a user to like a post
const likePost = async (request, response) => {
    const { postId, userId } = request.query;
    const user = await User.findById({ _id: userId });
    const post = await Post.findById({ _id: postId });

    if (!user) {
        return response.status(400).json({ message: "User not found!" });
    }
    if (!post) {
        return response.status(400).json({ message: "Post not found!" });
    }

    try {
        const ifLikeExists = await Like.findOne({ postId, userId });

        if (ifLikeExists) {
            return response
                .status(400)
                .json({ message: "You already liked this post!" });
        }
        const like = new Like({
            userId,
            postId,
        });
        await like.save();
        const postLikes = await Like.find({ postId: postId }).count();
        post.likes = postLikes;
        await post.save();
        return response.status(200).json({
            message: "Post liked successfully!",
        });
    } catch (error) {
        return response
            .status(500)
            .json({ message: error.message || "Some error occurred!" });
    }
};

const countPostLikes = async (request, response) => {
    try {
        const posts = await Like.find({ postId: request.query.postId }).count();
        return response.status(200).json({
            message: "Likes counted successfully!",
            likes: posts,
        });
    } catch (error) {
        return response
            .status(500)
            .json({ message: error.message || "Some error occurred!" });
    }
};

const deleteLikesFromPost = async (request, response) => {
    try {
        const postId = request.query.postId;
        const userId = request.query.userId;

        const like = await Like.findOne({ postId, userId });
        const post = await Post.findById({ _id: postId });
        const user = await User.findById({ _id: userId });

        if (!post) {
            return response.status(400).json({ message: "Post not found!" });
        }
        await Like.deleteOne({ postId, userId });
        const postLikes = await Like.find({ postId: postId }).count();
        post.likes = postLikes;
        await post.save();
        return response.status(200).json({
            message: "Like deleted successfully!",
        });
    } catch (error) {
        return response
            .status(500)
            .json({ message: error.message || "Some error occurred!" });
    }
};

module.exports = {
    likePost,
    countPostLikes,
    deleteLikesFromPost,
};
