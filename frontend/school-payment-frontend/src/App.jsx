import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";// Adjust path as needed
import Transactions from "./pages/Transactions";
import TransactionsBySchool from "./pages/TransactionsBySchool";
import TransactionStatus from "./pages/TransactionStatus";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ThemeToggle from "./components/ThemeToggle";
import { ThemeProvider } from "./components/ThemeProvider";
import AppNavbar from "./components/AppNavbar";

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        {/* Navbar */}
        <AppNavbar />
        {/* Main Content */}
        <main className="p-6">
          <Routes>
            <Route path="/" element={<Transactions />} />
            <Route path="/school" element={<TransactionsBySchool />} />
            <Route path="/status" element={<TransactionStatus />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </Router>
    </ThemeProvider>
  );
}