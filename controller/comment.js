const Comment = require("../models/comment");
const User = require("../models/user");
const Post = require("../models/post");
const { response } = require("express");

const commentPost = async (request, response) => {
    const { comment } = request.body;
    try {
        const postId = request.query.postId;
        const userId = request.query.userId;
        const comment1 = await Comment.findOne({ postId });
        const post = await Post.findById(postId);
        const user = await User.findById(userId);
        if (!post) {
            return response.status(400).json({ message: "Post not found!" });
        }

        if (!user) {
            return response.status(400).json({ message: "User not found!" });
        }
        const newComment = new Comment({
            userId: userId,
            postId: postId,
            comment: comment,
        });
        await newComment.save();
        post.comments.push({
            commentId: newComment._id,
            comment: comment,
            user: user._id,
        });
        await post.save();

        return response.status(200).json({
            message: "Comment posted successfully",
            comment: newComment.comment,
        });
    } catch (error) {
        console.log(error);
        return response
            .status(500)
            .json({ message: "Some error occured, try again later!!" });
    }
};

const getComment = async (request, response) => {
    try {
        const postId = request.query.postId;
        const post = await Post.findById(postId);

        if (!post) {
            return response.status(400).json({ message: "Post not found!" });
        }

        const comments = await Comment.find({ postId: post._id }).sort({
            createdAt: -1,
        });
        return response.status(200).json({
            message: "Comments fetched successfully",
            comments: comments,
        });
    } catch (error) {
        console.log(error);
        return response
            .status(500)
            .json({ message: "Some error occured, try again later!!" });
    }
};

const deleteComment = async (request, response) => {
    // a user can only delete his own comment from a post
    try {
        const commentId = request.query.commentId;
        const userId = request.query.userId;
        const postId = request.query.postId;

        const comment = await Comment.findById(commentId);
        const post = await Post.findById(postId);
        const user = await User.findById(userId);

        if (!comment) {
            return response.status(400).json({ message: "Comment not found!" });
        }
        if (!user) {
            return response.status(400).json({ message: "User not found!" });
        }
        if (!post) {
            return response.status(400).json({ message: "Post not found!" });
        }

        let notInComment = true;

        post.comments.forEach((comment, index) => {
            if (comment.commentId == commentId) {
                notInComment = false;
                post.comments.splice(index, 1);
                post.save();
                return response
                    .status(200)
                    .json({ message: "Comment deleted!" });
            }
        });
        if (notInComment) {
            return response.status(400).json({ message: "Comment not found!" });
        }
        await Comment.findByIdAndDelete(commentId);
    } catch (error) {
        console.log(error);
        return response
            .status(500)
            .json({ message: "Some error occured, try again later!!" });
    }
};

module.exports = {
    commentPost,
    getComment,
    deleteComment,
};
