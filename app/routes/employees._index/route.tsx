import { useLoaderData } from "react-router-dom";
import { getDB } from "~/db/getDB";

export async function loader() {
  const db = await getDB();
  const employees = await db.all("SELECT * FROM employees;");
  return { employees };
}

export default function EmployeesPage() {
  const { employees } = useLoaderData();

  return (
    <div>
      <h1>Employees List</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Full Name</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Email</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Phone Number</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Date of Birth</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Job Title</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Department</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Salary</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Start Date</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>End Date</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee: any) => (
            <tr key={employee.id}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{employee.full_name}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{employee.email}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{employee.phone_number}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{employee.date_of_birth}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{employee.job_title}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{employee.department}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>${employee.salary}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{employee.start_date}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{employee.end_date}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                <a
                  href={`/employees/${employee.id}`}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#ffc107", // Yellow background for edit action
                    color: "white",
                    textDecoration: "none",
                    borderRadius: "5px",
                    fontSize: "14px",
                    transition: "background-color 0.3s",
                  }}
                  onMouseEnter={(e) => (e.target as HTMLAnchorElement).style.backgroundColor = "#e0a800"}
                  onMouseLeave={(e) => (e.target as HTMLAnchorElement).style.backgroundColor = "#ffc107"}
                >
                  Edit
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />
      <ul style={{ padding: "0", listStyleType: "none" }}>
        <li style={{ marginBottom: "10px" }}>
          <a
            href="/employees/new"
            style={{
              padding: "10px 20px",
              backgroundColor: "#007BFF",
              color: "white",
              textDecoration: "none",
              borderRadius: "5px",
              display: "inline-block",
              fontSize: "16px",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) => (e.target as HTMLAnchorElement).style.backgroundColor = "#0056b3"}
            onMouseLeave={(e) => (e.target as HTMLAnchorElement).style.backgroundColor = "#007BFF"}
          >
            New Employee
          </a>
        </li>
        <li>
          <a
            href="/timesheets/"
            style={{
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "white",
              textDecoration: "none",
              borderRadius: "5px",
              display: "inline-block",
              fontSize: "16px",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) => (e.target as HTMLAnchorElement).style.backgroundColor = "#218838"}
            onMouseLeave={(e) => (e.target as HTMLAnchorElement).style.backgroundColor = "#28a745"}
          >
            Timesheets
          </a>
        </li>
      </ul>
    </div>
  );
}
