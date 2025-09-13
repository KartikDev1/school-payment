import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Transactions from "./pages/Transactions";
import TransactionsBySchool from "./pages/TransactionsBySchool";
import TransactionStatus from "./pages/TransactionStatus";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ThemeProvider } from "./components/ThemeProvider";
import AppNavbar from "./components/AppNavbar";
import { useAuth } from "./contexts/AuthContext";
import { Loader2 } from "lucide-react";

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-lg font-semibold text-muted-foreground">
          Checking authentication...
        </p>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppNavbar />
        <main className="p-6">
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Transactions />
                </PrivateRoute>
              }
            />
            <Route
              path="/school"
              element={
                <PrivateRoute>
                  <TransactionsBySchool />
                </PrivateRoute>
              }
            />
            <Route
              path="/status"
              element={
                <PrivateRoute>
                  <TransactionStatus />
                </PrivateRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </Router>
    </ThemeProvider>
  );
}
