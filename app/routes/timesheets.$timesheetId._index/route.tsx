import { Form, useLoaderData, redirect, useActionData } from "react-router-dom";
import { useState, useEffect } from "react";
import { json } from "@remix-run/node";
import { getDB } from "~/db/getDB";

export const loader = async ({ params }: { params: Record<string, string> }) => {
  const { timesheetId } = params;
  const db = await getDB();

  const timesheet = await db.get("SELECT * FROM timesheets WHERE id = ?", [timesheetId]);
  const employees = await db.all("SELECT * FROM employees");

  return { timesheet, employees };
};

export const action = async ({ request, params }: { request: Request, params: Record<string, string> }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const { timesheetId } = params;

  const errors: Record<string, string> = {};
  if (!data.start_time) errors.start_time = "This field is required";
  if (!data.end_time) errors.end_time = "This field is required";
  if (!data.employee_id) errors.employee_id = "This field is required";

  if (Object.keys(errors).length > 0) {
    return json(errors); 
  }

  const db = await getDB();
  await db.run(
    `UPDATE timesheets SET 
       start_time = ?, end_time = ?, employee_id = ? 
       WHERE id = ?`,
    [data.start_time, data.end_time, data.employee_id, timesheetId]
  );

  return redirect("/timesheets");
};

export default function EditTimesheetPage() {
  const { timesheet, employees } = useLoaderData();
  const actionErrors = useActionData() as Record<string, string>;
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (actionErrors) {
      setFormErrors(actionErrors);
    }
  }, [actionErrors]);

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

        .form-group {
          display: flex;
          flex-direction: column;
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

        .error-message {
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
        <h1>Edit Timesheet</h1>
        <Form method="post">
          <div className="form-group">
            <label htmlFor="start_time">Start Time<span className="required">*</span></label>
            <input
              type="datetime-local"
              name="start_time"
              id="start_time"
              defaultValue={timesheet?.start_time}
            />
            {formErrors.start_time && <span className="error-message">{formErrors.start_time}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="end_time">End Time<span className="required">*</span></label>
            <input
              type="datetime-local"
              name="end_time"
              id="end_time"
              defaultValue={timesheet?.end_time}
            />
            {formErrors.end_time && <span className="error-message">{formErrors.end_time}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="employee_id">Employee<span className="required">*</span></label>
            <select name="employee_id" id="employee_id" defaultValue={timesheet?.employee_id}>
              <option value="">Select an employee</option>
              {employees.map((employee: any) => (
                <option key={employee.id} value={employee.id}>
                  {employee.full_name}
                </option>
              ))}
            </select>
            {formErrors.employee_id && <span className="error-message">{formErrors.employee_id}</span>}
          </div>

          <button type="submit">Update Timesheet</button>
        </Form>

        <hr />
        <ul>
          <li><a href="/timesheets">Timesheets</a></li>
          <li><a href="/timesheets/new">New Timesheet</a></li>
        </ul>
      </div>
    </div>
  );
}
