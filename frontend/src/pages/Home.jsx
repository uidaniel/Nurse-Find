import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const FEATURES = [
  { icon: "🔍", title: "Search & Filter", desc: "Find nurses by service type, rating, or price" },
  { icon: "📋", title: "Easy Booking", desc: "Book care in minutes with real-time pricing" },
  { icon: "⭐", title: "Verified Nurses", desc: "All nurses are licensed and background-checked" },
  { icon: "📍", title: "Near You", desc: "Save multiple addresses for faster bookings" },
];

const SERVICES = [
  "Elderly Care", "Home Nursing", "Post-Operative Care",
  "Overnight Care", "Medication Support",
];

export default function Home() {
  const { user, role } = useAuth();

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Professional Nursing Care,<br className="hidden sm:block" /> At Your Door
          </h1>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
            Connect with verified, licensed nurses for home care, post-operative support,
            and more — on your schedule.
          </p>
          {user ? (
            <Link
              to={role === "nurse" ? "/nurse/dashboard" : "/dashboard"}
              className="bg-white text-primary-700 font-semibold px-8 py-3 rounded-lg hover:bg-primary-50 transition-colors inline-block"
            >
              Go to Dashboard →
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/register"
                className="bg-white text-primary-700 font-semibold px-8 py-3 rounded-lg hover:bg-primary-50 transition-colors"
              >
                Find a Nurse
              </Link>
              <Link
                to="/register/nurse"
                className="bg-primary-500 text-white font-semibold px-8 py-3 rounded-lg hover:bg-primary-400 transition-colors border border-primary-400"
              >
                Join as Nurse
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
          Services We Connect You With
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {SERVICES.map((s) => (
            <Link
              key={s}
              to={user ? `/search?q=${encodeURIComponent(s)}` : "/register"}
              className="bg-white border border-gray-200 text-gray-700 rounded-full px-5 py-2 text-sm font-medium hover:border-primary-400 hover:text-primary-700 transition-colors shadow-sm"
            >
              {s}
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
            Why Choose NurseFind?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="card text-center">
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {!user && (
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Ready to get started?</h2>
          <p className="text-gray-500 mb-6">Join thousands of patients and nurses on NurseFind</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register" className="btn-primary">
              Register as Patient
            </Link>
            <Link to="/register/nurse" className="btn-secondary">
              Register as Nurse
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
