import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getNurseProfile, toggleActiveStatus, updatePricePerHour } from "../../api/nurse";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../../components/Spinner";
import ErrorMsg from "../../components/ErrorMsg";

export default function NurseDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toggling, setToggling] = useState(false);
  const [pphInput, setPphInput] = useState("");
  const [updatingPph, setUpdatingPph] = useState(false);
  const [pphSuccess, setPphSuccess] = useState("");

  const fetchProfile = () =>
    getNurseProfile()
      .then((res) => setProfile(res.data.profile))
      .catch((err) => setError(err.response?.data?.message || "Failed to load profile"))
      .finally(() => setLoading(false));

  useEffect(() => { fetchProfile(); }, []);

  const handleToggle = async () => {
    setToggling(true);
    try {
      await toggleActiveStatus();
      await fetchProfile();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to toggle status");
    } finally {
      setToggling(false);
    }
  };

  const handlePphSubmit = async (e) => {
    e.preventDefault();
    setUpdatingPph(true);
    setPphSuccess("");
    try {
      await updatePricePerHour(Number(pphInput));
      setPphSuccess("Price updated!");
      setPphInput("");
      setTimeout(() => setPphSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update price");
    } finally {
      setUpdatingPph(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Nurse Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, {user?.name}</p>
      </div>

      <ErrorMsg message={error} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-2xl">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-lg">{user?.name}</h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <p className="text-xs text-gray-400 mt-0.5 capitalize">{profile?.accountType} Account</p>
            </div>
          </div>
          {!profile?.nursingInformation && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-700">
                Your profile is incomplete.{" "}
                <Link to="/nurse/complete-profile" className="font-medium underline">
                  Complete it now
                </Link>
              </p>
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Active Status</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">You are currently</p>
              <p className={`font-bold text-lg ${profile?.activeStatus ? "text-green-600" : "text-gray-400"}`}>
                {profile?.activeStatus ? "Active" : "Inactive"}
              </p>
            </div>
            <button
              onClick={handleToggle}
              disabled={toggling}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                profile?.activeStatus ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                  profile?.activeStatus ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            {profile?.activeStatus
              ? "Patients can find and book you"
              : "You are hidden from search results"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Price Per Hour</h2>
          <form onSubmit={handlePphSubmit} className="flex gap-2">
            <input
              type="number"
              min="0"
              step="0.01"
              className="input"
              placeholder="e.g. 25.00"
              value={pphInput}
              onChange={(e) => setPphInput(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary shrink-0" disabled={updatingPph}>
              {updatingPph ? "…" : "Update"}
            </button>
          </form>
          {pphSuccess && (
            <p className="text-green-600 text-sm mt-2">{pphSuccess}</p>
          )}
        </div>

        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-3">Quick Actions</h2>
          <div className="space-y-2">
            <Link to="/nurse/complete-profile" className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary-600 py-1">
              <span>📝</span> Complete / Update Profile
            </Link>
            <Link to="/nurse/services" className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary-600 py-1">
              <span>🏥</span> Manage My Services
            </Link>
            <Link to="/nurse/offers" className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary-600 py-1">
              <span>🎁</span> Manage My Offers
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
