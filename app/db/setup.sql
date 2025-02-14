DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS timesheets;

CREATE TABLE employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone_number TEXT,
    date_of_birth DATE,
    job_title TEXT,
    department TEXT,
    salary INTEGER,
    start_date DATE,
    end_date DATE
);

CREATE TABLE timesheets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    employee_id INTEGER NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);
-- DELETE FROM timesheets;
-- DELETE FROM employees;
