import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getBooking, updateBookingStatus } from "../../api/bookings";
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

const NEXT_STATUSES = {
  requested: ["cancelled"],
  matched: ["confirmed", "cancelled"],
  confirmed: ["cancelled"],
  nurse_arriving: [],
  in_progress: [],
  completed: [],
  cancelled: [],
};

export default function BookingDetail() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [nurseInfo, setNurseInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getBooking(id)
      .then((res) => {
        setBooking(res.data.booking);
        setNurseInfo(res.data.nurseInfo);
      })
      .catch((err) => setError(err.response?.data?.message || "Failed to load booking"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusChange = async (status) => {
    setUpdating(true);
    try {
      const { data } = await updateBookingStatus(id, status);
      setBooking(data.booking);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Spinner />;
  if (!booking) return <div className="max-w-2xl mx-auto px-4 py-8"><ErrorMsg message={error || "Booking not found"} /></div>;

  const nextStatuses = NEXT_STATUSES[booking.status] || [];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/bookings" className="text-gray-400 hover:text-gray-600">←</Link>
        <h1 className="text-2xl font-bold text-gray-900">Booking Details</h1>
      </div>

      <ErrorMsg message={error} />

      <div className="space-y-4">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">{booking.service}</h2>
            <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${STATUS_COLORS[booking.status]}`}>
              {booking.status.replace("_", " ")}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Address</p>
              <p className="font-medium">{booking.address}</p>
            </div>
            <div>
              <p className="text-gray-500">Service Cycle</p>
              <p className="font-medium">{booking.serviceInfo?.serviceCycle}</p>
            </div>
            <div>
              <p className="text-gray-500">Starts</p>
              <p className="font-medium">{new Date(booking.serviceInfo?.startAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-500">Ends</p>
              <p className="font-medium">{new Date(booking.serviceInfo?.endAt).toLocaleString()}</p>
            </div>
          </div>

          {booking.detailedInformation && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-gray-500 text-sm">Additional Information</p>
              <p className="text-sm mt-1">{booking.detailedInformation}</p>
            </div>
          )}
        </div>

        {booking.amount && (
          <div className="card">
            <h2 className="font-semibold text-gray-900 mb-3">Payment Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>${booking.amount.subTotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Processing fee</span>
                <span>${booking.amount.processingFee?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold border-t border-gray-100 pt-2">
                <span>Total</span>
                <span>${booking.amount.total?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {nurseInfo && (
          <div className="card">
            <h2 className="font-semibold text-gray-900 mb-3">Nurse</h2>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                {nurseInfo.user?.name?.[0]?.toUpperCase() || "N"}
              </div>
              <div>
                <p className="font-medium">{nurseInfo.user?.name}</p>
                <p className="text-sm text-gray-500">{nurseInfo.user?.email}</p>
              </div>
            </div>
          </div>
        )}

        {nextStatuses.length > 0 && (
          <div className="card">
            <h2 className="font-semibold text-gray-900 mb-3">Update Status</h2>
            <div className="flex flex-wrap gap-2">
              {nextStatuses.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  disabled={updating}
                  className={`text-sm px-3 py-1.5 rounded-lg font-medium capitalize transition-colors ${
                    s === "cancelled"
                      ? "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                      : "bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-200"
                  }`}
                >
                  {updating ? "…" : s.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
