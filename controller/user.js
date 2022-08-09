const randToken = require("rand-token");
const User = require("../models/user");
const Token = require("../models/token");
const passwordToken = require("../models/passwordToken");
const Comment = require("../models/comment");
const Post = require("../models/post");
const { passwordHash, passwordCompare } = require("../lib/bcrypt");
const { jwtSign } = require("../lib/auth");
const { sendMail } = require("../lib/mailer");

const generateToken = async (userId) => {
    let random = randToken.generate(16);
    const token = new Token({
        token: random,
        userId: userId,
    });
    const user = await User.findByIdAndUpdate(userId, { token: random });
    await token.save();
    await user.save();
    return random;
};

const register = async (request, response, next) => {
    const { fullname, email, password } = request.body;
    try {
        if (!fullname && !email && !password) {
            return response.status(400).json({
                message: "Please fill all fields",
            });
        }
        let userExists = await User.findOne({ email: email });
        if (userExists) {
            response.status(401).send(`Email: ${email} already exists`);
        }
        const hashedPassword = await passwordHash(password);
        const user = new User({
            fullname: fullname,
            email: email,
            password: hashedPassword,
        });
        await user.save();

        const random = await generateToken(user._id);
        let msg = `Your details have been captured, Thank you for registering, please use this code to verify your account: ${random}. This token will expire in 5 minutes`;
        await sendMail(msg, "Onboarding Email", email);
        return response.status(200).json({
            message: "User created successfully",
        });
    } catch (error) {
        response.status(500).send("Some error occured, try again later");
    }
};

const verifyEmail = async (request, response) => {
    const userId = request.query.id;
    const token = request.body.token;
    try {
        const user = await Token.findOne({ userId, token });
        const user1 = await User.findById(userId);
        if (user.expiresIn < new Date().getTime()) {
            return response.status(400).json({ message: "Token expired" });
        }
        user1.isVerfied = true;
        await user1.save();
        response.status(200).json({
            message: "Email verified successully",
        });
    } catch (error) {
        response.status(500).json({
            message: "Some error occured, try again later",
        });
    }
};

const resendToken = async (request, response) => {
    const userId = request.query.userId;
    const user = await User.findById(userId);
    const email = user.email;
    const random = await generateToken(userId);
    let msg = `Your verification code, please use this code to verify your account: ${random}. This token will expire in 5 minutes. If you did not request this, please ignore this email.`;
    await sendMail(msg, "Resend verification token", email);
    response.status(200).json({
        message: "Token has been sent successfully",
    });
};

module.exports = {
    register,
    verifyEmail,
    resendToken,
};
