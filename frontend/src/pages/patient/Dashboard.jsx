import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserDashboard } from "../../api/dashboard";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../../components/Spinner";
import ErrorMsg from "../../components/ErrorMsg";

const STATUS_COLORS = {
  requested: "bg-yellow-100 text-yellow-700",
  matched: "bg-blue-100 text-blue-700",
  confirmed: "bg-indigo-100 text-indigo-700",
  nurse_arriving: "bg-purple-100 text-purple-700",
  in_progress: "bg-orange-100 text-orange-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getUserDashboard()
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name} 👋
        </h1>
        <p className="text-gray-500 mt-1">Here&apos;s what&apos;s happening with your care</p>
      </div>

      <ErrorMsg message={error} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link to="/search" className="card hover:shadow-md transition-shadow text-center">
          <div className="text-3xl mb-2">🔍</div>
          <h3 className="font-semibold text-gray-900">Find a Nurse</h3>
          <p className="text-sm text-gray-500 mt-1">Search by service type</p>
        </Link>
        <Link to="/bookings" className="card hover:shadow-md transition-shadow text-center">
          <div className="text-3xl mb-2">📋</div>
          <h3 className="font-semibold text-gray-900">My Bookings</h3>
          <p className="text-sm text-gray-500 mt-1">View all your bookings</p>
        </Link>
        <Link to="/addresses" className="card hover:shadow-md transition-shadow text-center">
          <div className="text-3xl mb-2">📍</div>
          <h3 className="font-semibold text-gray-900">My Addresses</h3>
          <p className="text-sm text-gray-500 mt-1">Manage saved addresses</p>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
            <Link to="/bookings" className="text-sm text-primary-600 hover:underline">
              View all
            </Link>
          </div>
          {data?.recentBookings?.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">No bookings yet</p>
          ) : (
            <div className="space-y-3">
              {data?.recentBookings?.map((b) => (
                <Link
                  key={b._id}
                  to={`/bookings/${b._id}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{b.service}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
                      STATUS_COLORS[b.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {b.status.replace("_", " ")}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Nurse Offers</h2>
          {data?.nurseOffers?.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">No offers available</p>
          ) : (
            <div className="space-y-3">
              {data?.nurseOffers?.map((o) => (
                <div key={o._id} className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{o.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{o.description}</p>
                    </div>
                    <span className="text-sm font-bold text-primary-600 ml-3 shrink-0">
                      ${o.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
