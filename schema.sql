-- Smart College Resource and Student Information Management System
-- MySQL schema (STRICTLY follows the given design)

DROP DATABASE IF EXISTS smart_college_db;
CREATE DATABASE smart_college_db;
USE smart_college_db;

-- DEPARTMENT(DeptCode PK, DeptName UNIQUE, DeptHead)
CREATE TABLE DEPARTMENT (
  DeptCode VARCHAR(10) PRIMARY KEY,
  DeptName VARCHAR(100) NOT NULL UNIQUE,
  DeptHead VARCHAR(100) NOT NULL
);

-- STUDENT(StudentID PK, Name, Email UNIQUE, Phone, Department FK, Semester CHECK 1-8)
CREATE TABLE STUDENT (
  StudentID INT PRIMARY KEY,
  Name VARCHAR(100) NOT NULL,
  Email VARCHAR(120) NOT NULL UNIQUE,
  Phone VARCHAR(20),
  Department VARCHAR(10) NOT NULL,
  Semester INT NOT NULL,
  CONSTRAINT fk_student_department FOREIGN KEY (Department) REFERENCES DEPARTMENT(DeptCode),
  CONSTRAINT chk_student_semester CHECK (Semester BETWEEN 1 AND 8)
);

-- FACULTY(FacultyID PK, Name, Department FK, Designation)
CREATE TABLE FACULTY (
  FacultyID INT PRIMARY KEY,
  Name VARCHAR(100) NOT NULL,
  Department VARCHAR(10) NOT NULL,
  Designation VARCHAR(60) NOT NULL,
  CONSTRAINT fk_faculty_department FOREIGN KEY (Department) REFERENCES DEPARTMENT(DeptCode)
);

-- COURSE(CourseID PK, CourseName UNIQUE, Credits CHECK 1-6, FacultyID FK)
CREATE TABLE COURSE (
  CourseID INT PRIMARY KEY,
  CourseName VARCHAR(120) NOT NULL UNIQUE,
  Credits INT NOT NULL,
  FacultyID INT,
  CONSTRAINT fk_course_faculty FOREIGN KEY (FacultyID) REFERENCES FACULTY(FacultyID),
  CONSTRAINT chk_course_credits CHECK (Credits BETWEEN 1 AND 6)
);

-- RESOURCE(ResourceID PK, ResourceType, Location, Availability CHECK, Capacity)
-- Availability is implemented as ENUM for simple validation.
CREATE TABLE RESOURCE (
  ResourceID INT PRIMARY KEY,
  ResourceType VARCHAR(60) NOT NULL,
  Location VARCHAR(120) NOT NULL,
  Availability ENUM('AVAILABLE', 'NOT_AVAILABLE') NOT NULL,
  Capacity INT NOT NULL
);

-- ENROLLMENT(EnrollmentID PK, StudentID FK, CourseID FK, Semester, Grade, UNIQUE(StudentID, CourseID))
CREATE TABLE ENROLLMENT (
  EnrollmentID INT PRIMARY KEY,
  StudentID INT NOT NULL,
  CourseID INT NOT NULL,
  Semester INT NOT NULL,
  Grade VARCHAR(5),
  CONSTRAINT fk_enrollment_student FOREIGN KEY (StudentID) REFERENCES STUDENT(StudentID) ON DELETE CASCADE,
  CONSTRAINT fk_enrollment_course FOREIGN KEY (CourseID) REFERENCES COURSE(CourseID) ON DELETE CASCADE,
  CONSTRAINT uq_enrollment_student_course UNIQUE (StudentID, CourseID),
  CONSTRAINT chk_enrollment_semester CHECK (Semester BETWEEN 1 AND 8)
);

-- ATTENDANCE(AttendanceID PK, StudentID FK, CourseID FK, Percentage CHECK 0-100)
CREATE TABLE ATTENDANCE (
  AttendanceID INT PRIMARY KEY,
  StudentID INT NOT NULL,
  CourseID INT NOT NULL,
  Percentage DECIMAL(5,2) NOT NULL,
  CONSTRAINT fk_attendance_student FOREIGN KEY (StudentID) REFERENCES STUDENT(StudentID) ON DELETE CASCADE,
  CONSTRAINT fk_attendance_course FOREIGN KEY (CourseID) REFERENCES COURSE(CourseID) ON DELETE CASCADE,
  CONSTRAINT chk_attendance_percentage CHECK (Percentage BETWEEN 0 AND 100)
);

-- --------------------------
-- Sample Data (INSERT)
-- --------------------------

INSERT INTO DEPARTMENT (DeptCode, DeptName, DeptHead) VALUES
('CSE', 'Computer Science and Engineering', 'Dr. R. Sharma'),
('ECE', 'Electronics and Communication Engineering', 'Dr. P. Verma'),
('ME',  'Mechanical Engineering', 'Dr. A. Khan'),
('BCA', 'Bachelor of computer application', 'Dr. R. Sharma');
INSERT INTO STUDENT (StudentID, Name, Email, Phone, Department, Semester) VALUES
(1001, 'Aarav Patel', 'aarav.patel@example.com', '9876543210', 'CSE', 3),
(1002, 'Diya Singh', 'diya.singh@example.com', '9123456780', 'ECE', 5),
(1003, 'Kabir Mehta', 'kabir.mehta@example.com', '9988776655', 'CSE', 1);

INSERT INTO FACULTY (FacultyID, Name, Department, Designation) VALUES
(2001, 'Prof. N. Iyer', 'CSE', 'Assistant Professor'),
(2002, 'Prof. S. Rao', 'ECE', 'Associate Professor'),
(2003, 'Prof. M. Das', 'ME',  'Professor');

INSERT INTO COURSE (CourseID, CourseName, Credits, FacultyID) VALUES
(3001, 'DBMS', 4, 2001),
(3002, 'Digital Electronics', 3, 2002),
(3003, 'Thermodynamics', 4, 2003);

INSERT INTO RESOURCE (ResourceID, ResourceType, Location, Availability, Capacity) VALUES
(4001, 'LAB', 'CSE Block - Lab 1', 'AVAILABLE', 30),
(4002, 'CLASSROOM', 'Main Building - Room 101', 'AVAILABLE', 60),
(4003, 'PROJECTOR', 'Admin Office', 'NOT_AVAILABLE', 1);

INSERT INTO ENROLLMENT (EnrollmentID, StudentID, CourseID, Semester, Grade) VALUES
(5001, 1001, 3001, 3, 'A'),
(5002, 1002, 3002, 5, 'B'),
(5003, 1003, 3001, 1, NULL);

INSERT INTO ATTENDANCE (AttendanceID, StudentID, CourseID, Percentage) VALUES
(6001, 1001, 3001, 92.50),
(6002, 1002, 3002, 85.00),
(6003, 1003, 3001, 78.25);

