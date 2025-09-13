import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Transactions from "./pages/Transactions";
import TransactionsBySchool from "./pages/TransactionsBySchool";
import TransactionStatus from "./pages/TransactionStatus";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ThemeProvider } from "./components/ThemeProvider";
import AppNavbar from "./components/AppNavbar";
import { AuthProvider} from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppNavbar />
          <main className="p-6">
            <Routes>
              {/* ✅ Protected routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Transactions />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/school"
                element={
                  <ProtectedRoute>
                    <TransactionsBySchool />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/status"
                element={
                  <ProtectedRoute>
                    <TransactionStatus />
                  </ProtectedRoute>
                }
              />

              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
