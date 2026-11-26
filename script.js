
const API_URL = "http://localhost:3000/students";

const form = document.getElementById("studentForm");
const studentList = document.getElementById("studentList");
const totalStudents = document.getElementById("totalStudents");
let editingStudentId = null;

// Edit student
function editStudent(student) {
    editingStudentId = student.id;

    document.getElementById("name").value = student.name;
    document.getElementById("roll").value = student.roll;
    document.getElementById("department").value = student.department;

    document.getElementById("name").focus();
}
// Load students from database
async function loadStudents() {
    try {
        const response = await fetch(API_URL);
        const students = await response.json();

        studentList.innerHTML = "";

        students.forEach((student) => {
            const row = document.createElement("tr");

            [student.name, student.roll, student.department].forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });

            const actionCell = document.createElement("td");
            const deleteButton = document.createElement("button");

            deleteButton.textContent = "Delete";
            deleteButton.className = "delete-btn";
            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.className = "edit-btn";
            editButton.onclick = () => editStudent(student);
            deleteButton.onclick = () => deleteStudent(student.id);

            actionCell.appendChild(deleteButton);
            actionCell.appendChild(editButton);
            row.appendChild(actionCell);

            studentList.appendChild(row);
        });

        totalStudents.textContent = students.length;

    } catch (error) {
        alert("Unable to load students!");
        console.error(error);
    }
}
// Add or Update student
form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const student = {
        name: document.getElementById("name").value,
        roll: document.getElementById("roll").value,
        department: document.getElementById("department").value
    };

    try {
        const url = editingStudentId
            ? `${API_URL}/${editingStudentId}`
            : API_URL;

        const response = await fetch(url, {
            method: editingStudentId ? "PUT" : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(student)
        });

        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.error || "Unable to save student");
        }

        editingStudentId = null;
        form.reset();
        loadStudents();

        alert("Student saved successfully!");

    } catch (error) {
        alert(error.message);
    }
});
async function deleteStudent(id) {
    if (!confirm("Are you sure you want to delete?")) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) throw new Error("Delete failed");

        loadStudents();

    } catch (error) {
        alert(error.message);
    }
}

// Initial loading
loadStudents();
// Attendance Management
const attendanceForm = document.getElementById("attendanceForm");
const attendanceList = document.getElementById("attendanceList");

async function loadAttendance() {
    try {
        const response = await fetch("http://localhost:3000/attendance");
        const records = await response.json();

        attendanceList.innerHTML = "";

        records.forEach(record => {
            const row = document.createElement("tr");

            [
                record.student_name,
                record.roll,
                record.attendance_date,
                record.status
            ].forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });

            attendanceList.appendChild(row);
        });

    } catch (error) {
        console.error("Attendance loading failed:", error);
    }
}

attendanceForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const attendance = {
        student_name: document.getElementById("attendanceName").value,
        roll: document.getElementById("attendanceRoll").value,
        attendance_date: document.getElementById("attendanceDate").value,
        status: document.getElementById("attendanceStatus").value
    };

    try {
        const response = await fetch("http://localhost:3000/attendance", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(attendance)
        });

        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.error || "Unable to save attendance");
        }

        attendanceForm.reset();
        loadAttendance();
        alert("Attendance saved successfully!");

    } catch (error) {
        alert(error.message);
    }
});

loadAttendance();
console.log("EduManage script loaded!");
// Examination Management
const examForm = document.getElementById("examForm");
const examList = document.getElementById("examList");

async function loadExaminations() {
    try {
        const response = await fetch("http://localhost:3000/examinations");
        const records = await response.json();

        examList.innerHTML = "";

        records.forEach(record => {
            const row = document.createElement("tr");

            [
                record.student_name,
                record.roll,
                record.subject,
                record.marks
            ].forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });

            examList.appendChild(row);
        });
    } catch (error) {
        console.error("Examination loading failed:", error);
    }
}

examForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const exam = {
        student_name: document.getElementById("examName").value,
        roll: document.getElementById("examRoll").value,
        subject: document.getElementById("subject").value,
        marks: Number(document.getElementById("marks").value)
    };

    try {
        const response = await fetch("http://localhost:3000/examinations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(exam)
        });

        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.error || "Unable to save result");
        }

        examForm.reset();
        loadExaminations();
        alert("Examination result saved!");

    } catch (error) {
        alert(error.message);
    }
});

loadExaminations();
// Fees Management
const feesForm = document.getElementById("feesForm");
const feesList = document.getElementById("feesList");

async function loadFees() {
    try {
        const response = await fetch("http://localhost:3000/fees");
        const records = await response.json();

        feesList.innerHTML = "";

        records.forEach(record => {
            const row = document.createElement("tr");

            [
                record.student_name,
                record.roll,
                record.total_fees,
                record.paid_amount,
                record.pending_amount
            ].forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });

            feesList.appendChild(row);
        });
    } catch (error) {
        console.error("Fees loading failed:", error);
    }
}

feesForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const total = Number(document.getElementById("feeAmount").value);
    const paid = Number(document.getElementById("paidAmount").value);

    if (paid > total) {
        alert("Paid amount cannot exceed total fees!");
        return;
    }

    const fee = {
        student_name: document.getElementById("feeName").value,
        roll: document.getElementById("feeRoll").value,
        total_fees: total,
        paid_amount: paid
    };

    try {
        const response = await fetch("http://localhost:3000/fees", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(fee)
        });

        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.error || "Unable to save fees");
        }

        feesForm.reset();
        loadFees();
        alert("Fees saved successfully!");

    } catch (error) {
        alert(error.message);
    }
});

loadFees();