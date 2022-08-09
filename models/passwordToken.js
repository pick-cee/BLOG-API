const mongoose = require("mongoose");
const passTokenSchema = mongoose.Schema(
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
            default: new Date().getTime() + 1000000,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("passwordToken", passTokenSchema);
