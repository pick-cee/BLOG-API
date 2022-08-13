const Comment = require("../models/comment");
const User = require("../models/user");
const Post = require("../models/post");
const { response } = require("express");

const commentPost = async (request, response) => {
    const { comment } = request.body;
    try {
        const postId = request.query.postId;
        const userId = request.query.userId;
        const post = await Post.findById(postId);
        const user = await User.findById(userId);
        if (!post) {
            response.status(400).json({ message: "Post not found!" });
        }

        if (!user) {
            response.status(400).json({ message: "User not found!" });
        }
        const newComment = new Comment({
            userId: userId,
            postId: postId,
            comment: comment,
        });
        const commentData = await newComment.save();
        post.comment.push(commentData._id);
        await post.save();
        // const pos1 = await Post.findByIdAndUpdate(
        //     postId,
        //     { comment: commentData._id },
        //     { new: true }
        // );
        return response.status(200).json({
            message: "Comment posted successfully",
            comment: commentData,
        });
    } catch (error) {
        console.log(error);
        response
            .status(500)
            .json({ message: "Some error occured, try again later!!" });
    }
};

const getComment = async (request, response) => {
    try {
        const postId = request.query.postId;
        const post = await Post.findById(postId);

        if (!post) {
            response.status(400).json({ message: "Post not found!" });
        }

        const comments = await Comment.find(post._id).sort({ createdAt: -1 });
        response.status(200).json({
            message: "Comments fetched successfully",
            comments: comments,
        });
    } catch (error) {
        console.log(error);
        response
            .status(500)
            .json({ message: "Some error occured, try again later!!" });
    }
};

const deleteComment = async (request, response) => {
    try {
        const commentId = request.query.commentId;
        const userId = request.query.userId;
        const comment = await Comment.findById(commentId);
        const user = await User.findById(userId);
        if (!comment) {
            response.status(400).json({ message: "Comment not found!" });
        }
        if (!user) {
            response.status(400).json({ message: "User not found!" });
        }
        await Post.findByIdAndUpdate(
            comment.postId,
            { comment: [] },
            { new: true }
        );
        await Comment.findByIdAndDelete(commentId);

        response.status(200).json({ message: "Comment deleted successfully!" });
    } catch (error) {
        console.log(error);
        response
            .status(500)
            .json({ message: "Some error occured, try again later!!" });
    }
};

module.exports = {
    commentPost,
    getComment,
    deleteComment,
};
