const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
require('dotenv').config()
const errorMiddleware = require("./middleware/Error");
const connectDatabase = require("./config/connect");
const router = require("./routes");

const app = express();

app.use(express.json())
app.use(cors({ origin: "*" }));
app.use(helmet());
app.use(express.static('public'));

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.status(200).json({ status: 200, success: true, message: "working finely" })
});
app.use("/api", router);

app.use((req, res, next) => {
    res.status(404).json({ status: 404, success: false, message: "Page not found on the server" });
})
app.use(errorMiddleware);

app.listen(process.env.port, async () => {
    try {
        console.log(`Server is listing on http://localhost:${port}`)
        await connectDatabase()
    } catch (error) {
        // console.log("app.listen ~ error:", error)
        console.log(`Something is wrong`);
    }
});

process.on("unhandledRejection", (err) => {
    console.log("Error inside the unhandledrejection ========>", err)
    console.log(`Error:${err.message}`);
    console.log(`Shutting down due to unhandled promise rejection ========>`);
});
