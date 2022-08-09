const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtSign = (payload) => {
    return (
        jwt.sign(payload, process.env.JWT_SECRET),
        {
            algorithm: "HS256",
            expiresIn: 60 * 60 * 24,
        }
    );
};

const jwtVerify = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return false;
    }
};

const verifyUserToken = (request, response, next) => {
    try {
        const authHeader = request.headers.authorization;
        let result;
        if (authHeader) {
            const token = request.headers.authHeader.split(" ")[1];
            result = jwt(token);
            if (!result) {
                response.status(400).send("Invalid bearer token");
            } else {
                request.decoded = result;
                next();
            }
        } else {
            response.status(500).send("Token is required!");
        }
    } catch (error) {
        return response.status(500).json({
            error: error,
        });
    }
};

module.exports = { jwtSign, jwtVerify, verifyUserToken };
