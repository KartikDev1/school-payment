import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ThemeToggle from "../components/ThemeToggle"
import { useAuth } from "../contexts/AuthContext";

export default function AppNavbar() {
     const { isAuthenticated, logout } = useAuth();
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        {/* Left: Branding */}
        <Link to="/" className="text-lg font-bold">
          School Payments
        </Link>

        {/* Right: Links + Toggle */}
        <nav className="flex items-center gap-2">
          <Link to="/">
            <Button variant="ghost" size="sm">
              Transactions
            </Button>
          </Link>
          <Link to="/school">
            <Button variant="ghost" size="sm">
              By School
            </Button>
          </Link>
          <Link to="/status">
            <Button variant="ghost" size="sm">
              Check Status
            </Button>
          </Link>
        <div className="flex gap-4 items-center">
          {!isAuthenticated ? (
            <>
              <Link to="/login">
                <Button size="sm" variant="secondary">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" variant="secondary">
                  Register
                </Button>
              </Link>
            </>
          ) : (
            <Link to="/login">
            <Button size="sm" variant="destructive" onClick={logout}>
              Logout
            </Button>
            </Link>
          )}
          <ThemeToggle />
        </div>
        </nav>
      </div>
    </header>
  );
}
