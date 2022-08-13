const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const commentRoutes = require("./routes/comment");
require("dotenv").config();

mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("DB connected successfully"))
    .catch((err) => console.log(err));

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (request, response) => {
    response.send("Welcome to the Home Page");
});

app.use("/blog", userRoutes);
app.use("/blog", postRoutes);
app.use("/blog", commentRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
