import { useState } from "react";
import { Form, useLoaderData, redirect } from "react-router-dom";
import { getDB } from "~/db/getDB";

export const loader = async ({ params }: { params: Record<string, string> }) => {
  const { employeeId } = params;
  const db = await getDB();
  const employee = await db.get("SELECT * FROM employees WHERE id = ?", [employeeId]);
  return { employee };
};

export const action = async ({ request, params }: { request: Request, params: Record<string, string> }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const { employeeId } = params;
  const db = await getDB();

  await db.run(
    `UPDATE employees SET 
       full_name = ?, email = ?, phone_number = ?, date_of_birth = ?, 
       job_title = ?, department = ?, salary = ?, start_date = ?, end_date = ? 
       WHERE id = ?`,
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
      employeeId,
    ]
  );

  return redirect("/employees");
};

export default function EditEmployeePage() {
  const { employee } = useLoaderData();

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    let newErrors: Record<string, string> = {};

    if (!formData.get("full_name")?.toString().trim()) {
      newErrors["full_name"] = "This field is required";
    }
    if (!formData.get("email")?.toString().trim()) {
      newErrors["email"] = "This field is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    event.currentTarget.submit();
  };

  return (
    <div className="form-container">
      <h1>Edit Employee</h1>
      <Form method="post" onSubmit={validateForm}>
        <div className="form-group">
          <label htmlFor="full_name">Full Name <span className="required">*</span></label>
          <input type="text" name="full_name" id="full_name" defaultValue={employee?.full_name} />
          {errors.full_name && <p className="error">{errors.full_name}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email <span className="required">*</span></label>
          <input type="email" name="email" id="email" defaultValue={employee?.email} />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="phone_number">Phone Number</label>
          <input type="text" name="phone_number" id="phone_number" defaultValue={employee?.phone_number} />
        </div>

        <div className="form-group">
          <label htmlFor="date_of_birth">Date of Birth</label>
          <input type="date" name="date_of_birth" id="date_of_birth" defaultValue={employee?.date_of_birth} />
        </div>

        <div className="form-group">
          <label htmlFor="job_title">Job Title</label>
          <input type="text" name="job_title" id="job_title" defaultValue={employee?.job_title} />
        </div>

        <div className="form-group">
          <label htmlFor="department">Department</label>
          <input type="text" name="department" id="department" defaultValue={employee?.department} />
        </div>

        <div className="form-group">
          <label htmlFor="salary">Salary</label>
          <input type="number" name="salary" id="salary" defaultValue={employee?.salary} />
        </div>

        <div className="form-group">
          <label htmlFor="start_date">Start Date</label>
          <input type="date" name="start_date" id="start_date" defaultValue={employee?.start_date} />
        </div>

        <div className="form-group">
          <label htmlFor="end_date">End Date</label>
          <input type="date" name="end_date" id="end_date" defaultValue={employee?.end_date} />
        </div>

        <button type="submit">Update Employee</button>
      </Form>

      <style>{`
        .form-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          margin-bottom: 15px;
        }

        label {
          font-weight: bold;
          color: #555;
        }

        .required {
          color: red;
          font-weight: bold;
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
          font-size: 0.875rem;
          margin-top: 5px;
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
      `}</style>
    </div>
  );
}
