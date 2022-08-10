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
        let subject = "ONBOARDING EMAIL";
        let html = `
        <br /><div style="flex-direction:column; justify-content:center; align-items:center;">
            <h1>Registration successful!</h1>
            <p>Your details have been captured.</p>
            <p>Please use this code to veriy your email: ${random}</p>
            <p>This token will expire in 5 minutes</p>
            <p>Akin's Blog! </p><br><br>
        </div>
        `;
        await sendMail(html, subject, email);
        return response.status(201).json({
            User_Details: user,
            message:
                "User created successfully, check mail for verification code. Check your spam folder",
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
    let subject = "VERIFICATION CODE";
    let html = `
        <br /><div style="flex-direction:column; justify-content:center; align-items:center;">
            <h1>Request successful!</h1>
            <p>Please use this code to veriy your email: ${random}</p>
            <p>This token will expire in 5 minutes</p>
            <p>If you did not request this, please ignore this email. Thak you!</p>
            <p>Akin's Blog! </p><br><br>
        </div>
        `;
    await sendMail(html, subject, email);
    response.status(200).json({
        message: "Token has been sent successfully. Check your spam folder",
    });
};

const login = async (request, response) => {
    const { email, password } = request.body;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            response.status(400).send({
                message: "User does not exists",
            });
        }
        const passwordMatch = await passwordCompare(password, user.password);
        if (!passwordMatch) {
            response.status(400).send({
                message: "Incorrect password",
            });
        }
        let payload = {
            _id: user._id,
            email: user.email,
            fullname: user.fullname,
        };
        const token = jwtSign(payload);
        response.status(200).send({
            message: "User logged in successfully",
            data: payload,
            token: token,
        });
    } catch (error) {
        response.status(500).json({
            message: "Some error occured!",
        });
    }
};

const forgotPassword = async (request, response) => {
    const { email } = request.body;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            response.status(400).json({ message: "User not found" });
        }
        const token = randToken.generate(16);
        console.log(token);
        let subject = "FORGOT PASSWORD";
        let html = `
        <br /><div style="flex-direction:column; justify-content:center; align-items:center;">
            <h1>Request successful!</h1>
            <p>Please use this code to reset your password: ${token}</p>
            <p>This token will expire in 5 minutes</p>
            <p>If you did not request this, please ignore this email. Thak you!</p>
            <p>Akin's Blog! </p><br><br>
        </div>
        `;
        await sendMail(html, subject, email);
        const passwordToken1 = new passwordToken({
            token: token,
            userId: user._id,
        });
        await passwordToken1.save();

        return response.status(200).json({
            message:
                "Reset password token successfully sent!!. Check your spam folder.",
        });
    } catch (error) {
        response.status(500).json({ message: "Some error occured!" });
    }
};

const resetPassword = async (request, response) => {
    const { token, password, confirmPassword } = request.body;
    try {
        if (!password && !confirmPassword) {
            response.status(401).json({ message: "Please fill all fields" });
        }
        if (password !== confirmPassword) {
            response.status(401).json({ message: "Passwords do not match" });
        }
        const token1 = await passwordToken.findOne({ token: token });
        console.log(token1);
        if (!token1) {
            response.status(401).json({ message: "Token is invalid" });
        }
        if (token1.expiresIn < new Date().getTime()) {
            return response.status(400).json({ message: "Token expired" });
        }
        const user = await User.findOne({ _id: token1.userId });
        // console.log(user);
        const hashedPassword = await passwordHash(password);
        user.password = hashedPassword;
        // console.log(hashedPassword, password);
        await user.save();
        response.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        response.status(500).send({
            message: "Some error occured, try again later!",
        });
    }
};

module.exports = {
    register,
    verifyEmail,
    resendToken,
    login,
    forgotPassword,
    resetPassword,
};
