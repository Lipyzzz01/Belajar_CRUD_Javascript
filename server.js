const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// View engine setup
app.set("view engine", "ejs");
app.set("views", "views");

// Database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "db_ejs"
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to database:", err);
        return;
    }
    console.log("Database connected successfully");
});

// Routes
app.get("/", (req, res) => {
    const sql = "SELECT * FROM user";
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error fetching users:", err);
            return res.status(500).send("An error occurred");
        }
        res.render("index", {
            users: result,
            title: "AlipGs"
        });
    });
});

app.post("/tambah", (req, res) => {
    const { namaDepan, namaBelakang } = req.body;
    const sql = "INSERT INTO user (namaDepan, namaBelakang) VALUES (?, ?)";
    db.query(sql, [namaDepan, namaBelakang], (err, result) => {
        if (err) {
            console.error("Error adding user:", err);
            return res.status(500).send("An error occurred");
        }
        res.redirect("/");
    });
});

app.get("/edit/:id", (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM user WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error fetching user for edit:", err);
            return res.status(500).send("An error occurred");
        }
        if (result.length === 0) {
            return res.status(404).send("User not found");
        }
        res.render("edit", {
            user: result[0],
            title: "Edit User"
        });
    });
});

app.post("/update", (req, res) => {
    const { id, namaDepan, namaBelakang } = req.body;
    const sql = "UPDATE user SET namaDepan = ?, namaBelakang = ? WHERE id = ?";
    db.query(sql, [namaDepan, namaBelakang, id], (err, result) => {
        if (err) {
            console.error("Error updating user:", err);
            return res.status(500).send("An error occurred");
        }
        res.redirect("/");
    });
});

app.get("/delete/:id", (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM user WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error deleting user:", err);
            return res.status(500).send("An error occurred");
        }
        res.redirect("/");
    });
});


// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});