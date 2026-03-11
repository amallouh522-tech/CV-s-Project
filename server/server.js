require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const mysql = require("mysql");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");
const bcrypt = require("bcrypt");

const app = express();

const jwtSecret = process.env.JWT_SECRET || "Anas@ABC$i2vfvdknsd";

// middleware
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60
    }
}));

const DB = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});
DB.connect((err) => {
    if (err) {
        console.error("Error connecting to database:", err);
    } else {
        console.log("Connected to database");
    }
});

app.post("/api/register", async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !password || !email) {
        res.status(400).json({ succ: false, msg: "Please fill all fields" });
    } else {
        DB.query(
            "SELECT * FROM `users` WHERE username=? OR email=?",
            [username, email],
            async (err, result) => {
                if (err) {
                    res.status(500).json({ succ: false, msg: "Error In Database" });
                    console.error("Error In register : ", err);
                };
                if (result.length > 0) {
                    res.status(409).json({ succ: false, msg: "already using username Or email" });
                } else {
                    const Hashed_Pass = await bcrypt.hash(password, 10);
                    console.log(Hashed_Pass);

                    DB.query(
                        "INSERT INTO `users`(`username`, `password`, `email`) VALUES (?,?,?)",
                        [username, Hashed_Pass, email],
                        (err, result) => {
                            if (err) {
                                res.status(500).json({ succ: false, msg: "Error In Database" });
                                console.error("Error In register : ", err);
                            }
                            if (result.affectedRows > 0) {
                                res.status(201).json({ succ: true });
                            };
                        }
                    );
                };
            }
        );
    };
});

app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ succ: false, msg: "Please fill all fields" });
    };
    DB.query(
        "SELECT * FROM `users` WHERE username=?",
        [username],
        async (err, result) => {
            if (err) {
                res.status(500).json({ succ: false, msg: "Error In Database" });
                console.error("error in login : ", err);
            };
            if (result.length > 0) {
                const usr = result[0];
                const tokenData = {username : usr.username , ID:usr.ID};
                const IS_match = await bcrypt.compare(password, usr.password);
                if (IS_match) {
                    req.session.user = usr;
                    const token = jwt.sign(
                        {tokenData},
                        jwtSecret,
                        { expiresIn: "1h" } // مدة الصلاحية ساعة
                    );
                    res.status(200).json({ succ: true });
                } else {
                    res.status(401).json({ succ: false, msg: "Invalid username Or password" });
                };
            };
        }
    );
});

app.listen(5001, () => {
    console.log("Server running on port 5001");
});