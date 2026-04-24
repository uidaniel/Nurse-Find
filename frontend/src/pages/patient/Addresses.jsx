import { useEffect, useState } from "react";
import { getAddresses, addAddress } from "../../api/addresses";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../../components/Spinner";
import ErrorMsg from "../../components/ErrorMsg";

const EMPTY = { label: "", address: "", city: "", state: "", country: "" };

export default function Addresses() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const fetchAddresses = () => {
    getAddresses()
      .then((res) => setAddresses(res.data.addresses || []))
      .catch((err) => {
        if (err.response?.status !== 400) {
          setError(err.response?.data?.message || "Failed to load addresses");
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAddresses(); }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaveError("");
    setSaving(true);
    try {
      await addAddress({ ...form, user: user._id });
      setForm(EMPTY);
      setShowForm(false);
      fetchAddresses();
    } catch (err) {
      setSaveError(err.response?.data?.message || "Failed to add address");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Addresses</h1>
          <p className="text-gray-500 mt-1">Saved service locations</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="btn-primary text-sm"
        >
          {showForm ? "Cancel" : "+ Add Address"}
        </button>
      </div>

      <ErrorMsg message={error} />

      {showForm && (
        <div className="card mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">New Address</h2>
          <form onSubmit={handleAdd} className="space-y-3">
            <div>
              <label className="label">Label</label>
              <input className="input" placeholder="e.g. Home, Work" value={form.label} onChange={set("label")} required />
            </div>
            <div>
              <label className="label">Address</label>
              <input className="input" placeholder="Street address" value={form.address} onChange={set("address")} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">City</label>
                <input className="input" value={form.city} onChange={set("city")} required />
              </div>
              <div>
                <label className="label">State</label>
                <input className="input" value={form.state} onChange={set("state")} required />
              </div>
            </div>
            <div>
              <label className="label">Country</label>
              <input className="input" value={form.country} onChange={set("country")} required />
            </div>
            <ErrorMsg message={saveError} />
            <button type="submit" className="btn-primary w-full" disabled={saving}>
              {saving ? "Saving…" : "Save Address"}
            </button>
          </form>
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📍</div>
          <h2 className="text-lg font-semibold text-gray-900">No addresses saved</h2>
          <p className="text-gray-500 mt-2">Add your first address to speed up bookings</p>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((a) => (
            <div key={a._id} className="card">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📍</span>
                <div>
                  <p className="font-semibold text-gray-900">{a.label}</p>
                  <p className="text-sm text-gray-600 mt-0.5">{a.address}</p>
                  <p className="text-sm text-gray-500">
                    {[a.city, a.state, a.country].filter(Boolean).join(", ")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
