require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const mysql = require("mysql");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");
const bcrypt = require("bcrypt");
const axios = require("axios");

const app = express();

const jwtSecret = process.env.JWT_SECRET || "Anas@ABC$i2vfvdknsd";

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // يتوقع توكن بصيغة: Bearer TOKEN

    if (!token) return res.status(401).json({ succ: false, msg: "Access Denied: No Token Provided" });

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) return res.status(403).json({ succ: false, msg: "Invalid or Expired Token" });
        req.user = user; // حفظ بيانات المستخدم في الطلب لاستخدامها لاحقاً
        next(); // السماح بالانتقال للمسار التالي
    });
};

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

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.TRP_USER, // تأكد من تحديثه إذا قمت بتغييره
        pass: process.env.TRP_PASS, // تأكد من تحديثه إذا قمت بتغييره
    },
    // إعدادات إضافية لمنع التعليق
    connectionTimeout: 10000,
    greetingTimeout: 10000,
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
                    const OTP = Math.floor(100000 + Math.random() * 900000).toString();
                    console.log(OTP);
                    req.session.user = { username: username, email: email, password: Hashed_Pass, OTP: OTP };
                    
                    
                    transporter.sendMail({
                        from: process.env.TRP_FROM, // تأكد من تحديثه إذا قمت بتغييره
                        to: email,
                        subject: "Your OTP Code",
                        text: `Your OTP code is: ${OTP}`,
                    }, (error, info) => {
                        if (error) {
                            console.error("Error sending email:", error);
                            res.status(500).json({ succ: false, msg: "Error sending OTP email" });
                        } else {
                            console.log("Email sent:", info.response);
                            res.status(200).json({ succ: true, msg: "OTP sent to your email" });
                        };
                    });
                    
                };
            }
        );
    };
});

app.post("/api/verify-token", (req, res) => {
    const { OTP } = req.body;
    if (!OTP) {
        return res.status(400).json({ succ: false, msg: "OTP is required" });
    };
    const username = req.session.user?.username;
    const Email = req.session.user?.email;
    const password = req.session.user?.password;
    if (!username) {
        return res.status(401).json({ succ: false, msg: "Unauthorized" });
    };
    if (OTP === req.session.user.OTP) {
        DB.query(
            "INSERT INTO `users`(`username`, `password`, `email`) VALUES (?,?,?)",
            [username, password, Email],
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
    } else {
        res.status(400).json({ succ: false, msg: "Invalid OTP" });
    }
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
                const tokenData = { username: usr.username, ID: usr.ID };
                const IS_match = await bcrypt.compare(password, usr.password);
                if (IS_match) {
                    req.session.user = usr;
                    const token = jwt.sign(
                        { tokenData },
                        jwtSecret,
                        { expiresIn: "1h" } // مدة الصلاحية ساعة
                    );
                    res.status(200).json({ succ: true, token });
                } else {
                    res.status(401).json({ succ: false, msg: "Invalid username Or password" });
                };
            };
        }
    );
});

app.post("/api/auth/github/callback", async (req, res) => {
    const { code } = req.body;

    if (!code) return res.status(400).json({ succ: false, msg: "Code is required" });

    try {
        // 1. تبديل الـ Code بـ Access Token
        const response = await axios.post("https://github.com/login/oauth/access_token", {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code: code,
        }, { headers: { Accept: "application/json" } });

        const accessToken = response.data.access_token;
        if (!accessToken) return res.status(401).json({ succ: false, msg: "Invalid GitHub Code" });

        // 2. جلب بيانات المستخدم من GitHub API
        const userRes = await axios.get("https://api.github.com/user", {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        const { id, login, email } = userRes.data;
        const userEmail = email || `${login}@github.com`; // حل مشكلة الإيميل الخاص في جيت هاب

        // 3. البحث عن المستخدم في DB
        DB.query("SELECT * FROM users WHERE github_id = ? OR email = ?", [id, userEmail], (err, result) => {
            if (err) return res.status(500).json({ succ: false, msg: "DB Error" });

            if (result.length > 0) {
                // مستخدم موجود مسبقاً -> إصدار توكن مباشرة
                const user = result[0];
                const token = jwt.sign({ tokenData: { username: user.username, ID: user.ID } }, jwtSecret, { expiresIn: "1h" });
                return res.json({ succ: true, token, user: user.username, msg: "Welcome back!" });
            } else {
                // مستخدم جديد -> تسجيله في DB
                DB.query(
                    "INSERT INTO users (username, email, github_id) VALUES (?, ?, ?)",
                    [login, userEmail, id],
                    (insertErr, insertResult) => {
                        if (insertErr) return res.status(500).json({ succ: false, msg: "Failed to create user" });

                        // إصدار توكن للمستخدم الجديد
                        const token = jwt.sign(
                            { tokenData: { username: login, ID: insertResult.insertId } },
                            jwtSecret,
                            { expiresIn: "1h" }
                        );
                        return res.json({ succ: true, token, user: login, msg: "Account created via GitHub!" });
                    }
                );
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ succ: false, msg: "Auth failed" });
    }
});

app.post("/api/profile", authenticateToken, (req, res) => {
    res.json({ msg: "Welcome to your profile", user: req.user });
});

app.listen(5001, () => {
    console.log("Server running on port 5001");
});