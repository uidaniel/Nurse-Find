import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerNurse } from "../../api/auth";
import ErrorMsg from "../../components/ErrorMsg";

export default function RegisterNurse() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "nurse",
    accountType: "Individual",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerNurse(form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Join as a Nurse</h1>
          <p className="text-gray-500 mt-2">Create your nurse account</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input className="input" value={form.name} onChange={set("name")} required />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" value={form.email} onChange={set("email")} required />
            </div>
            <div>
              <label className="label">Phone</label>
              <input type="tel" className="input" value={form.phone} onChange={set("phone")} required />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" className="input" value={form.password} onChange={set("password")} required minLength={6} />
            </div>
            <div>
              <label className="label">Account Type</label>
              <select className="input" value={form.accountType} onChange={set("accountType")}>
                <option value="Individual">Individual</option>
                <option value="Organization">Organization</option>
              </select>
            </div>

            <ErrorMsg message={error} />

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? "Creating account…" : "Create Nurse Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-primary-600 hover:underline font-medium">
              Sign in
            </Link>
          </p>
          <p className="text-center text-sm text-gray-500 mt-2">
            Looking for care?{" "}
            <Link to="/register" className="text-primary-600 hover:underline font-medium">
              Register as patient
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
