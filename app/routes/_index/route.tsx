import { Link } from "react-router-dom";

export default function RootPage() {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to the Employee Management System</h1>
      <p style={styles.paragraph}>Please choose an option:</p>
      <ul style={styles.list}>
        <li style={styles.listItem}>
          <Link to="/employees" style={{ ...styles.link, ...styles.linkBlue }}>
            View Employees
          </Link>
        </li>
        <li style={styles.listItem}>
          <Link to="/employees/new" style={{ ...styles.link, ...styles.linkGreen }}>
            Create New Employee
          </Link>
        </li>
        <li style={styles.listItem}>
          <Link to="/timesheets" style={{ ...styles.link, ...styles.linkPurple }}>
            View Timesheets
          </Link>
        </li>
      </ul>
    </div>
  );
}
//css styles
const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f4f7fc",
    fontFamily: "'Roboto', sans-serif",
    padding: "20px",
  },
  heading: {
    fontSize: "2.8rem",
    color: "#333",
    marginBottom: "15px",
    fontWeight: 700,
  },
  paragraph: {
    fontSize: "1.3rem",
    color: "#666",
    marginBottom: "40px",
    textAlign: "center" as "center",
  },
  list: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column" as "column",
    gap: "20px",
  },
  listItem: {
    display: "flex",
    justifyContent: "center",
  },
  link: {
    textDecoration: "none",
    fontSize: "1.2rem",
    fontWeight: "500",
    borderRadius: "8px",
    padding: "12px 24px",
    display: "inline-block",
    transition: "all 0.3s ease-in-out",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
  linkBlue: {
    backgroundColor: "#007bff",
    color: "#fff",
  },
  linkGreen: {
    backgroundColor: "#28a745",
    color: "#fff",
  },
  linkPurple: {
    backgroundColor: "#6f42c1",
    color: "#fff",
  },
};
