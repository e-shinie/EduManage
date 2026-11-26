
const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY
);

// Test API
app.get("/", (req, res) => {
    res.send("EduManage API Connected! 💜");
});

// Get all students
app.get("/students", async (req, res) => {
    const { data, error } = await supabase
        .from("students")
        .select("*");

    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
});

// Add student
app.post("/students", async (req, res) => {
    const { name, roll, department } = req.body;

    const { data, error } = await supabase
        .from("students")
        .insert([{ name, roll, department }])
        .select();

    if (error) return res.status(400).json({ error: error.message });

    res.json(data);
});
// Get attendance records
app.get("/attendance", async (req, res) => {
    const { data, error } = await supabase
        .from("attendance")
        .select("*");

    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
});

// Add attendance
app.post("/attendance", async (req, res) => {
    const { student_name, roll, attendance_date, status } = req.body;

    const { data, error } = await supabase
        .from("attendance")
        .insert([{ student_name, roll, attendance_date, status }])
        .select();

    if (error) return res.status(400).json({ error: error.message });

    res.json(data);
});
// Get examination results
app.get("/examinations", async (req, res) => {
    const { data, error } = await supabase
        .from("examinations")
        .select("*");

    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
});

// Add examination result
app.post("/examinations", async (req, res) => {
    const { student_name, roll, subject, marks } = req.body;

    const { data, error } = await supabase
        .from("examinations")
        .insert([{ student_name, roll, subject, marks }])
        .select();

    if (error) return res.status(400).json({ error: error.message });

    res.json(data);
});
// Get fees records
app.get("/fees", async (req, res) => {
    const { data, error } = await supabase
        .from("fees")
        .select("*");

    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
});

// Add fees record
app.post("/fees", async (req, res) => {
    const { student_name, roll, total_fees, paid_amount } = req.body;

    const pending_amount = total_fees - paid_amount;

    if (total_fees < 0 || paid_amount < 0 || paid_amount > total_fees) {
        return res.status(400).json({ error: "Please enter valid fee amounts" });
    }

    const { data, error } = await supabase
        .from("fees")
        .insert([{ student_name, roll, total_fees, paid_amount, pending_amount }])
        .select();

    if (error) return res.status(400).json({ error: error.message });

    res.json(data);
});
// Update student
app.put("/students/:id", async (req, res) => {
    const { name, roll, department } = req.body;

    const { data, error } = await supabase
        .from("students")
        .update({ name, roll, department })
        .eq("id", req.params.id)
        .select();

    if (error) return res.status(400).json({ error: error.message });

    res.json(data);
});
// Delete student
app.delete("/students/:id", async (req, res) => {
    const { error } = await supabase
        .from("students")
        .delete()
        .eq("id", req.params.id);

    if (error) return res.status(400).json({ error: error.message });

    res.json({ message: "Student deleted successfully" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`EduManage server running on port ${PORT}`);
});