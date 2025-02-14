import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { getDB } from "~/db/getDB";
import Calendar from "react-calendar";
import type { CalendarProps } from "react-calendar";
import "react-calendar/dist/Calendar.css";

export async function loader() {
  const db = await getDB();
  const timesheetsAndEmployees = await db.all(
    "SELECT timesheets.*, employees.full_name, employees.id AS employee_id FROM timesheets JOIN employees ON timesheets.employee_id = employees.id"
  );
  return { timesheetsAndEmployees };
}

export default function TimesheetsPage() {
  const { timesheetsAndEmployees } = useLoaderData();
  const [view, setView] = useState("table"); 
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date()); 

  const handleViewChange = (newView: string) => {
    setView(newView);
  };

  const filteredTimesheets = timesheetsAndEmployees.filter((timesheet: any) =>
    new Date(timesheet.start_time).toDateString() === selectedDate?.toDateString()
  );

  const handleDateChange: CalendarProps['onChange'] = (value, event) => {
    if (Array.isArray(value)) {
      setSelectedDate(value[0]); 
    } else {
      setSelectedDate(value); 
    }
  };

  return (
    <div>
      <h1>Timesheets List</h1>
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => handleViewChange("table")}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            transition: "background-color 0.3s",
          }}
          onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = "#0056b3"}
          onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = "#007BFF"}
        >
          Table View
        </button>
        <button
          onClick={() => handleViewChange("calendar")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            transition: "background-color 0.3s",
          }}
          onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = "#218838"}
          onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = "#28a745"}
        >
          Calendar View
        </button>
      </div>

      {view === "table" ? (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Employee Name</th>
              <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Start Time</th>
              <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>End Time</th>
              <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {timesheetsAndEmployees.map((timesheet: any) => (
              <tr key={timesheet.id}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{timesheet.full_name}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{timesheet.start_time}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{timesheet.end_time}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  <a
                    href={`/timesheets/${timesheet.id}`}
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
      ) : (
        <div>
          <Calendar
            onChange={handleDateChange} 
            value={selectedDate}
          />
          <div>
            <h3>Timesheets on {selectedDate?.toDateString()}</h3>
            {filteredTimesheets.length > 0 ? (
              <ul>
                {filteredTimesheets.map((timesheet: any) => (
                  <li key={timesheet.id}>
                    {timesheet.full_name} worked from {timesheet.start_time} to {timesheet.end_time}.
                  </li>
                ))}
              </ul>
            ) : (
              <p>No timesheets for this date.</p>
            )}
          </div>
        </div>
      )}

      <hr />
      <ul style={{ padding: "0", listStyleType: "none" }}>
        <li style={{ marginBottom: "10px" }}>
          <a
            href="/timesheets/new"
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
            New Timesheet
          </a>
        </li>
        <li>
          <a
            href="/employees"
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
            Employees
          </a>
        </li>
      </ul>
    </div>
  );
}
