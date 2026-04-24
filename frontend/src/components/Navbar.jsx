import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-primary-600">
          NurseFind
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              {role === "patient" && (
                <>
                  <Link to="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
                    Dashboard
                  </Link>
                  <Link to="/search" className="text-sm text-gray-600 hover:text-gray-900">
                    Find Nurses
                  </Link>
                  <Link to="/bookings" className="text-sm text-gray-600 hover:text-gray-900">
                    My Bookings
                  </Link>
                  <Link to="/addresses" className="text-sm text-gray-600 hover:text-gray-900">
                    Addresses
                  </Link>
                </>
              )}
              {role === "nurse" && (
                <>
                  <Link to="/nurse/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
                    Dashboard
                  </Link>
                  <Link to="/nurse/services" className="text-sm text-gray-600 hover:text-gray-900">
                    My Services
                  </Link>
                  <Link to="/nurse/offers" className="text-sm text-gray-600 hover:text-gray-900">
                    My Offers
                  </Link>
                </>
              )}
              <span className="text-sm text-gray-500 hidden sm:block">
                {user.name}
              </span>
              <button onClick={handleLogout} className="btn-secondary text-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900">
                Login
              </Link>
              <Link to="/register" className="btn-primary text-sm">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
