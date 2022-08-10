const nodemailer = require("nodemailer");
require("dotenv").config();

exports.sendMail = async (msg, subject, receiver) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            // attachments: [
            //     {
            //         filename: "blogpic.png",
            //         path: "../www/blogpic.png",
            //         cid: "blogpic@akin.com",
            //     },
            // ],
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
        const mailOptions = {
            from: "Akin's Blog",
            to: receiver,
            subject: subject,
            html: msg,
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log(`Email sent: ${info.response}`);
            }
        });
    } catch (err) {
        return err;
    }
};
