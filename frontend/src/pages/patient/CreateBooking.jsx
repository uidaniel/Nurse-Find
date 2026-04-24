import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { createBooking } from "../../api/bookings";
import { useAuth } from "../../context/AuthContext";
import ErrorMsg from "../../components/ErrorMsg";

const SERVICES = [
  "Elderly Care",
  "Home Nursing",
  "Post-Operative Care",
  "Overnight Care",
  "Medication Support",
];

export default function CreateBooking() {
  const { state } = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nurse: state?.nurseUserId || "",
    service: SERVICES[0],
    detailedInformation: "",
    address: "",
    serviceInfo: { startAt: "", endAt: "", serviceCycle: "One-Time" },
    nurseOffers: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const setInfo = (k) => (e) =>
    setForm({ ...form, serviceInfo: { ...form.serviceInfo, [k]: e.target.value } });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createBooking({
        ...form,
        serviceInfo: {
          ...form.serviceInfo,
          startAt: new Date(form.serviceInfo.startAt).toISOString(),
          endAt: new Date(form.serviceInfo.endAt).toISOString(),
        },
      });
      navigate("/bookings");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/search" className="text-gray-400 hover:text-gray-600">←</Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Book a Nurse</h1>
          {state?.nurseName && (
            <p className="text-gray-500 mt-0.5">Booking with {state.nurseName}</p>
          )}
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-5">
          {!state?.nurseUserId && (
            <div>
              <label className="label">Nurse ID (MongoDB)</label>
              <input
                className="input"
                placeholder="Enter nurse user ID"
                value={form.nurse}
                onChange={set("nurse")}
                required
              />
            </div>
          )}

          <div>
            <label className="label">Service Type</label>
            <select className="input" value={form.service} onChange={set("service")} required>
              {SERVICES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Address</label>
            <input
              className="input"
              placeholder="Service location"
              value={form.address}
              onChange={set("address")}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Start Date & Time</label>
              <input
                type="datetime-local"
                className="input"
                value={form.serviceInfo.startAt}
                onChange={setInfo("startAt")}
                required
              />
            </div>
            <div>
              <label className="label">End Date & Time</label>
              <input
                type="datetime-local"
                className="input"
                value={form.serviceInfo.endAt}
                onChange={setInfo("endAt")}
                required
              />
            </div>
          </div>

          <div>
            <label className="label">Service Cycle</label>
            <select className="input" value={form.serviceInfo.serviceCycle} onChange={setInfo("serviceCycle")}>
              <option value="One-Time">One-Time</option>
              <option value="Recurring">Recurring</option>
            </select>
          </div>

          <div>
            <label className="label">Additional Information</label>
            <textarea
              className="input resize-none"
              rows={3}
              placeholder="Any specific needs or instructions…"
              value={form.detailedInformation}
              onChange={set("detailedInformation")}
              required
            />
          </div>

          <ErrorMsg message={error} />

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Booking…" : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
}
