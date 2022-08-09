const mongoose = require("mongoose");
const tokenSchema = mongoose.Schema(
    {
        token: {
            type: String,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "users",
        },
        expiresIn: {
            type: Date,
            default: new Date().getTime() + 600000,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("token", tokenSchema);
