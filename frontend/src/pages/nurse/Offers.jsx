import { useEffect, useState } from "react";
import { createOffer, editOffer, deleteOffer } from "../../api/nurse";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../../components/Spinner";
import ErrorMsg from "../../components/ErrorMsg";

const EMPTY = { title: "", description: "", price: "" };

export default function NurseOffers() {
  const { user } = useAuth();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const fetchOffers = async () => {
    try {
      const { data } = await api.get("/user/dashboard");
      const allOffers = await Promise.all(
        (data.nurseOffers || []).map((o) => api.get(`/offer/${o._id}`).then((r) => r.data.offer))
      );
      setOffers(allOffers.filter(Boolean));
    } catch {
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOffers(); }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleEdit = (offer) => {
    setForm({ title: offer.title, description: offer.description, price: offer.price });
    setEditingId(offer._id);
    setShowForm(true);
    setSaveError("");
  };

  const handleCancel = () => {
    setForm(EMPTY);
    setEditingId(null);
    setShowForm(false);
    setSaveError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveError("");
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price) };
      if (editingId) {
        await editOffer(editingId, payload);
      } else {
        await createOffer(payload);
      }
      handleCancel();
      setLoading(true);
      await fetchOffers();
    } catch (err) {
      setSaveError(err.response?.data?.message || "Failed to save offer");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this offer?")) return;
    try {
      await deleteOffer(id);
      setOffers((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Offers</h1>
          <p className="text-gray-500 mt-1">Special offers for patients</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn-primary text-sm">
            + New Offer
          </button>
        )}
      </div>

      <ErrorMsg message={error} />

      {showForm && (
        <div className="card mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">
            {editingId ? "Edit Offer" : "New Offer"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Title</label>
              <input className="input" value={form.title} onChange={set("title")} required />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea
                className="input resize-none"
                rows={3}
                value={form.description}
                onChange={set("description")}
                required
              />
            </div>
            <div>
              <label className="label">Price ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="input"
                value={form.price}
                onChange={set("price")}
                required
              />
            </div>
            <ErrorMsg message={saveError} />
            <div className="flex gap-2">
              <button type="submit" className="btn-primary flex-1" disabled={saving}>
                {saving ? "Saving…" : editingId ? "Update Offer" : "Create Offer"}
              </button>
              <button type="button" onClick={handleCancel} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {offers.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🎁</div>
          <h2 className="text-lg font-semibold text-gray-900">No offers yet</h2>
          <p className="text-gray-500 mt-2">Create special offers to attract more patients</p>
        </div>
      ) : (
        <div className="space-y-3">
          {offers.map((o) => (
            <div key={o._id} className="card">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{o.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{o.description}</p>
                </div>
                <span className="text-lg font-bold text-primary-600 shrink-0">
                  ${o.price}
                </span>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(o)}
                  className="btn-secondary text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(o._id)}
                  className="btn-danger text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
