# Smart College Resource and Student Information Management System

**Tech used (simple, local):**
- **Frontend**: HTML + CSS + JavaScript (vanilla)
- **Backend**: Node.js + Express
- **Database**: MySQL
- **DB connector**: `mysql2` (prepared statements)

---

## Folder structure

```
DBMS_FINAL/
  db.js
  server.js
  schema.sql
  package.json
  public/
    index.html
    students.html
    courses.html
    enrollments.html
    attendance.html
    resources.html
    css/
      app.css
    js/
      common.js
  src/
    routes/
      departments.js
      students.js
      faculty.js
      courses.js
      enrollments.js
      attendance.js
      resources.js
    utils/
      validate.js
  node_modules/   (created after npm install)
```

---

## Database (STRICT schema)

The exact schema + sample data is in:
- `schema.sql`

Tables implemented exactly as required:
- `DEPARTMENT(DeptCode PK, DeptName UNIQUE, DeptHead)`
- `STUDENT(StudentID PK, Name, Email UNIQUE, Phone, Department FK, Semester CHECK 1-8)`
- `FACULTY(FacultyID PK, Name, Department FK, Designation)`
- `COURSE(CourseID PK, CourseName UNIQUE, Credits CHECK 1-6, FacultyID FK)`
- `RESOURCE(ResourceID PK, ResourceType, Location, Availability CHECK, Capacity)`
- `ENROLLMENT(EnrollmentID PK, StudentID FK, CourseID FK, Semester, Grade, UNIQUE(StudentID, CourseID))`
- `ATTENDANCE(AttendanceID PK, StudentID FK, CourseID FK, Percentage CHECK 0-100)`

> Note: For `RESOURCE.Availability`, MySQL validation is implemented using `ENUM('AVAILABLE','NOT_AVAILABLE')` (simple & strict).

---

## Installation (what to install)

### 1) Install Node.js
- Install **Node.js (LTS)** from the official site.
- Verify:

```bash
node -v
npm -v
```

### 2) Install MySQL
- Install **MySQL Server 8.x**
- Optionally install **MySQL Workbench** (easy GUI to run SQL files)

---

## Setup and run (step-by-step)

### Step A — Create DB + tables + sample data

#### Option 1: Using MySQL Workbench (recommended)
- Open Workbench → connect to your MySQL
- Open `schema.sql`
- Click the lightning ⚡ (Execute)

#### Option 2: Using MySQL Command Line
From the project folder:

```bash
mysql -u root -p < schema.sql
```

If your root has **no password**, you can try:

```bash
mysql -u root < schema.sql
```

### Step B — Configure DB login in `db.js`
Open `db.js` and edit:
- `user` (default: `root`)
- `password` (default: empty string `""`)

### Step C — Install backend dependencies
From the project folder:

```bash
npm install
```

### Step D — Run the server

```bash
npm start
```

Server runs at:
- `http://localhost:3000`

---

## How to use the app (frontend pages)

- **Dashboard**: `http://localhost:3000/index.html`
- **Students** (Add/View/Update/Delete): `/students.html`
- **Courses** (Add/View/Update/Delete + Assign Faculty): `/courses.html`
- **Enrollments** (Enroll/View/Update/Delete): `/enrollments.html`
- **Attendance** (Add/View/Update/Delete): `/attendance.html`
- **Resources** (Add/View/Update/Delete): `/resources.html`

Health check (DB connectivity):
- `http://localhost:3000/api/health`

---

## API endpoints (clear + beginner-friendly)

### Student Management (CRUD)
- `GET /api/students`
- `POST /api/students`
- `PUT /api/students/:StudentID`
- `DELETE /api/students/:StudentID`

### Course Management (CRUD + assign faculty)
- `GET /api/courses`
- `POST /api/courses`
- `PUT /api/courses/:CourseID`
- `DELETE /api/courses/:CourseID`
- `PUT /api/courses/:CourseID/assign-faculty`

### Enrollment Module
- `GET /api/enrollments`
- `POST /api/enrollments`
- `PUT /api/enrollments/:EnrollmentID`
- `DELETE /api/enrollments/:EnrollmentID`

### Attendance Module
- `GET /api/attendance`
- `POST /api/attendance`
- `PUT /api/attendance/:AttendanceID`
- `DELETE /api/attendance/:AttendanceID`

### Resource Module
- `GET /api/resources`
- `POST /api/resources`
- `PUT /api/resources/:ResourceID`
- `DELETE /api/resources/:ResourceID`

### (Extra) Department + Faculty CRUD (useful for DBMS demo)
- `GET /api/departments` / `POST` / `PUT /:DeptCode` / `DELETE /:DeptCode`
- `GET /api/faculty` / `POST` / `PUT /:FacultyID` / `DELETE /:FacultyID`

---

## Sample screenshots (what to capture)

For your report/demo, you can take screenshots like:
- **Dashboard** showing all module cards + “Health Check”
- **Students page**: filled “Add Student” form + student table showing inserted record
- **Courses page**: add course + **Assign Faculty** section + course table with faculty name
- **Enrollment page**: enroll student into course + enrollment table
- **Attendance page**: add attendance percentage + attendance table
- **Resources page**: add lab/classroom/projector + availability badge

---

## Viva questions with answers (DBMS + project)

1) **What is a Primary Key?**
- A column (or set of columns) that uniquely identifies each row in a table (e.g., `StudentID` in `STUDENT`).

2) **What is a Foreign Key?**
- A column that references a primary key in another table to maintain referential integrity (e.g., `STUDENT.Department` → `DEPARTMENT.DeptCode`).

3) **Why use UNIQUE constraints?**
- To prevent duplicate values (e.g., `STUDENT.Email` must be unique; `COURSE.CourseName` must be unique).

4) **Why use the ENROLLMENT unique constraint (StudentID, CourseID)?**
- Ensures a student can’t enroll in the same course multiple times.

5) **What is normalization used for here?**
- To reduce redundancy: departments are stored once in `DEPARTMENT`, and students reference them by `DeptCode`.

6) **What are prepared statements and why use them?**
- SQL with placeholders (like `?`) that is compiled safely; prevents SQL injection and improves reliability.

7) **How is input validation handled?**
- Backend checks types/ranges (Semester 1–8, Credits 1–6, Attendance 0–100) before hitting the database.

8) **Explain one join used in the project.**
- `STUDENT` joined with `DEPARTMENT` to show both `DeptCode` and `DeptName` when listing students.

9) **What happens if you delete a student who has enrollments/attendance?**
- Because of `ON DELETE CASCADE` on those foreign keys, related enrollments/attendance rows are deleted automatically.

10) **How do you check the backend is connected to MySQL?**
- Open `/api/health` or click “Check /api/health” on the dashboard.

---

## Common errors (quick fix)

- **ER_ACCESS_DENIED_ERROR**: wrong MySQL username/password → update `db.js`.
- **Unknown database 'smart_college_db'**: you didn’t import `schema.sql` → run it again.
- **Port already in use**: close old node process or change `PORT` in `server.js`.

