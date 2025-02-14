import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfigPath = path.join(__dirname, '../database.yaml');
const dbConfig = yaml.load(fs.readFileSync(dbConfigPath, 'utf8'));

const { sqlite_path: sqlitePath } = dbConfig;

const db = new sqlite3.Database(sqlitePath);

const employees = [
  {
    full_name: 'John Doe',
    email: 'john.doe@example.com',
    phone_number: '123-456-7890',
    date_of_birth: '1990-01-01',
    job_title: 'Software Engineer',
    department: 'Engineering',
    salary: 80000,
    start_date: '2020-01-01',
    end_date: null, 
  },
  {
    full_name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone_number: '987-654-3210',
    date_of_birth: '1985-05-15',
    job_title: 'Product Manager',
    department: 'Product',
    salary: 90000,
    start_date: '2019-06-01',
    end_date: null, 
  },
  {
    full_name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    phone_number: '555-555-5555',
    date_of_birth: '1995-12-25',
    job_title: 'UX Designer',
    department: 'Design',
    salary: 75000,
    start_date: '2021-03-15',
    end_date: null, 
  },
];

const timesheets = [
  {
    employee_id: 1,
    start_time: '2025-02-10 08:00:00',
    end_time: '2025-02-10 17:00:00',
  },
  {
    employee_id: 2,
    start_time: '2025-02-11 12:00:00',
    end_time: '2025-02-11 17:00:00',
  },
  {
    employee_id: 3,
    start_time: '2025-02-12 07:00:00',
    end_time: '2025-02-12 16:00:00',
  },
];

const insertData = (table, data) => {
  const columns = Object.keys(data[0]).join(', ');
  const placeholders = Object.keys(data[0]).map(() => '?').join(', ');

  const insertStmt = db.prepare(`INSERT INTO ${table} (${columns}) VALUES (${placeholders})`);

  data.forEach((row) => {
    insertStmt.run(Object.values(row));
  });

  insertStmt.finalize();
};

db.serialize(() => {
  db.run('DROP TABLE IF EXISTS employees');
  db.run('DROP TABLE IF EXISTS timesheets');

  db.run(`
    CREATE TABLE employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone_number TEXT,
      date_of_birth DATE,
      job_title TEXT NOT NULL,
      department TEXT NOT NULL,
      salary INTEGER,
      start_date DATE NOT NULL,
      end_date DATE
    )
  `);

  db.run(`
    CREATE TABLE timesheets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      start_time DATETIME NOT NULL,
      end_time DATETIME NOT NULL,
      employee_id INTEGER NOT NULL,
      FOREIGN KEY (employee_id) REFERENCES employees(id)
    )
  `);

  insertData('employees', employees);
  insertData('timesheets', timesheets);
});

db.close((err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Database seeded successfully.');
  }
});