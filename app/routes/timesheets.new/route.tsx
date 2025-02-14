import { useState } from "react";
import { useLoaderData, Form, redirect } from "react-router-dom";
import { getDB } from "~/db/getDB";

export async function loader() {
  const db = await getDB();
  const employees = await db.all("SELECT id, full_name FROM employees");
  return { employees };
}

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const db = await getDB();
  await db.run(
    "INSERT INTO timesheets (employee_id, start_time, end_time) VALUES (?, ?, ?)",
    [data.employee_id, data.start_time, data.end_time]
  );

  return redirect("/timesheets");
};

export default function NewTimesheetPage() {
  const { employees } = useLoaderData();
  const [errors, setErrors] = useState({
    employee_id: "",
    start_time: "",
    end_time: "",
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const employee_id = form.employee_id.value;
    const start_time = form.start_time.value;
    const end_time = form.end_time.value;
    let valid = true;
    let newErrors = { employee_id: "", start_time: "", end_time: "" };

    if (!employee_id) {
      newErrors.employee_id = "This field is required";
      valid = false;
    }

    if (!start_time) {
      newErrors.start_time = "This field is required";
      valid = false;
    }

    if (!end_time) {
      newErrors.end_time = "This field is required";
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
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

        input[type="datetime-local"],
        select {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1rem;
        }

        input[type="datetime-local"]:focus,
        select:focus {
          border-color: #007bff;
          outline: none;
        }

        .error {
          color: red;
          font-size: 0.9rem;
          margin-top: 5px;
        }

        button[type="submit"] {
          padding: 10px 20px;
          background-color: #007bff;
          color: #fff;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        button[type="submit"]:hover {
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
            .required {
          color: red;
          font-weight: bold;
        }
      `}</style>

      <div className="form-container">
        <h1>Create New Timesheet</h1>
        <Form method="post" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="employee_id">Employee<span className="required">*</span></label>
            <select name="employee_id" id="employee_id">
              <option value="">Select Employee</option>
              {employees.map((employee: { id: number; full_name: string }) => (
                <option key={employee.id} value={employee.id}>
                  {employee.full_name}
                </option>
              ))}
            </select>
            {errors.employee_id && <p className="error">{errors.employee_id}</p>}
          </div>

          <div>
            <label htmlFor="start_time">Start Time<span className="required">*</span></label>
            <input type="datetime-local" name="start_time" id="start_time" />
            {errors.start_time && <p className="error">{errors.start_time}</p>}
          </div>

          <div>
            <label htmlFor="end_time">End Time<span className="required">*</span></label>
            <input type="datetime-local" name="end_time" id="end_time" />
            {errors.end_time && <p className="error">{errors.end_time}</p>}
          </div>

          <button type="submit">Create Timesheet</button>
        </Form>

        <hr />
        <ul>
          <li><a href="/timesheets">Timesheets</a></li>
          <li><a href="/employees">Employees</a></li>
        </ul>
      </div>
    </div>
  );
}
