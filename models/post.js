const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        post: {
            type: String,
            required: true,
        },
        comment: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "comment",
            },
        ],
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "like",
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("post", postSchema);
