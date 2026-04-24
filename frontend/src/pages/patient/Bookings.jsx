import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBookings } from "../../api/bookings";
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

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getBookings()
      .then((res) => setBookings(res.data.bookings || []))
      .catch((err) => {
        if (err.response?.status !== 404) {
          setError(err.response?.data?.message || "Failed to load bookings");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-500 mt-1">All your nurse booking requests</p>
        </div>
        <Link to="/bookings/create" className="btn-primary text-sm">
          + New Booking
        </Link>
      </div>

      <ErrorMsg message={error} />

      {bookings.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📋</div>
          <h2 className="text-lg font-semibold text-gray-900">No bookings yet</h2>
          <p className="text-gray-500 mt-2 mb-6">Find a nurse and make your first booking</p>
          <Link to="/search" className="btn-primary">
            Find a Nurse
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <Link
              key={b._id}
              to={`/bookings/${b._id}`}
              className="card flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <p className="font-semibold text-gray-900">{b.service}</p>
                <p className="text-sm text-gray-500 mt-0.5">{b.address}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(b.serviceInfo?.startAt).toLocaleString()} →{" "}
                  {new Date(b.serviceInfo?.endAt).toLocaleString()}
                </p>
              </div>
              <div className="text-right ml-4 shrink-0">
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium capitalize block ${
                    STATUS_COLORS[b.status] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {b.status.replace("_", " ")}
                </span>
                {b.amount?.total != null && (
                  <p className="text-sm font-bold text-gray-900 mt-2">
                    ${b.amount.total.toFixed(2)}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
