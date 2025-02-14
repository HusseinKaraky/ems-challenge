import { useState } from "react";
import { Form, redirect } from "react-router-dom";
import { getDB } from "~/db/getDB";

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  // Server-side validation 
  if (!data.full_name || !data.email) {
    return { error: "Full Name and Email are required." };
  }

  const db = await getDB();
  await db.run(
    `INSERT INTO employees 
     (full_name, email, phone_number, date_of_birth, job_title, department, salary, start_date, end_date) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.full_name,
      data.email,
      data.phone_number,
      data.date_of_birth,
      data.job_title,
      data.department,
      data.salary,
      data.start_date,
      data.end_date,
    ]
  );

  return redirect("/employees");
};

export default function NewEmployeePage() {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const newErrors: { [key: string]: string } = {};

    const requiredFields = ["full_name", "email"];
    requiredFields.forEach((field) => {
      const input = form.elements.namedItem(field) as HTMLInputElement;
      if (!input.value.trim()) {
        newErrors[field] = "This field is required.";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      form.submit();
    }
  };

  return (
    <div>
      <style>{`
        .form-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
          .required {
          color: red;
          font-weight: bold;
        }
        h1 {
          text-align: center;
          color: #333;
        }

        form {
          display: grid;
          gap: 15px;
        }

        label {
          font-weight: bold;
          color: #555;
        }

        input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1rem;
        }

        input:focus {
          border-color: #007bff;
          outline: none;
        }

        .error {
          color: red;
          font-size: 0.9rem;
          margin-top: 5px;
        }

        .input-error {
          border-color: red !important;
        }

        button {
          padding: 10px 20px;
          background-color: #007bff;
          color: #fff;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        button:hover {
          background-color: #0056b3;
        }

        hr {
          margin-top: 30px;
        }

        ul {
          list-style-type: none;
          padding: 0;
        }

        ul li {
          display: inline-block;
          margin-right: 15px;
        }

        ul li a {
          text-decoration: none;
          color: #007bff;
        }

        ul li a:hover {
          color: #0056b3;
        }
      `}</style>
      <div className="form-container">
        <h1>Create New Employee</h1>
        <Form method="post" onSubmit={validateForm}>
          <div>
            <label htmlFor="full_name">Full Name<span className="required">*</span></label>
            <input
              type="text"
              name="full_name"
              id="full_name"
              className={errors.full_name ? "input-error" : ""}
            />
            {errors.full_name && <div className="error">{errors.full_name}</div>}
          </div>

          <div>
            <label htmlFor="email">Email<span className="required">*</span></label>
            <input
              type="email"
              name="email"
              id="email"
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <div className="error">{errors.email}</div>}
          </div>

          <div>
            <label htmlFor="phone_number">Phone Number</label>
            <input type="tel" name="phone_number" id="phone_number" />
          </div>

          <div>
            <label htmlFor="date_of_birth">Date of Birth</label>
            <input type="date" name="date_of_birth" id="date_of_birth" />
          </div>

          <div>
            <label htmlFor="job_title">Job Title</label>
            <input type="text" name="job_title" id="job_title" />
          </div>

          <div>
            <label htmlFor="department">Department</label>
            <input type="text" name="department" id="department" />
          </div>

          <div>
            <label htmlFor="salary">Salary</label>
            <input type="number" name="salary" id="salary" />
          </div>

          <div>
            <label htmlFor="start_date">Start Date</label>
            <input type="date" name="start_date" id="start_date" />
          </div>

          <div>
            <label htmlFor="end_date">End Date</label>
            <input type="date" name="end_date" id="end_date" />
          </div>

          <button type="submit">Create Employee</button>
        </Form>

        <hr />
        <ul>
          <li><a href="/employees">Employees</a></li>
          <li><a href="/timesheets">Timesheets</a></li>
        </ul>
      </div>
    </div>
  );
}
