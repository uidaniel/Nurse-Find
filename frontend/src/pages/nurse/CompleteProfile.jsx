import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { completeNurseProfile } from "../../api/nurse";
import { useAuth } from "../../context/AuthContext";
import ErrorMsg from "../../components/ErrorMsg";

export default function CompleteProfile() {
  const { user } = useAuth();
  const accountType = user?.accountType || "Individual";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [individual, setIndividual] = useState({
    nurseType: "",
    licenseNumber: "",
    yearsOfExperience: "",
    areaOfSpecialization: [],
  });

  const [org, setOrg] = useState({
    organisationDetails: {
      organizationName: "",
      organizationDescription: "",
      organizationEmail: "",
      organizationPhoneNumber: "",
    },
    organizationVerification: {
      operatingLicense: "",
      organizationProofOfAddress: "",
      organizationCACDocument: "",
      taxIdentificationNumber: "",
    },
    organizationRepresentative: {
      fullName: "",
      role: "HR Manager",
      phoneNumber: "",
    },
  });

  const setI = (k) => (e) => setIndividual({ ...individual, [k]: e.target.value });
  const setOrgField = (section, k) => (e) =>
    setOrg({ ...org, [section]: { ...org[section], [k]: e.target.value } });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload =
        accountType === "Individual"
          ? { nursingInformation: { ...individual, yearsOfExperience: Number(individual.yearsOfExperience) } }
          : org;
      await completeNurseProfile(payload);
      navigate("/nurse/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/nurse/dashboard" className="text-gray-400 hover:text-gray-600">←</Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Complete Profile</h1>
          <p className="text-gray-500 mt-0.5">{accountType} Account</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-5">
          {accountType === "Individual" ? (
            <>
              <div>
                <label className="label">Nurse Type</label>
                <input className="input" placeholder="e.g. Registered Nurse, LPN" value={individual.nurseType} onChange={setI("nurseType")} required />
              </div>
              <div>
                <label className="label">License Number</label>
                <input className="input" value={individual.licenseNumber} onChange={setI("licenseNumber")} required />
              </div>
              <div>
                <label className="label">Years of Experience</label>
                <input type="number" min="0" className="input" value={individual.yearsOfExperience} onChange={setI("yearsOfExperience")} />
              </div>
            </>
          ) : (
            <>
              <fieldset className="space-y-3">
                <legend className="text-sm font-semibold text-gray-700 mb-2">Organization Details</legend>
                {[
                  ["organizationName", "Organization Name"],
                  ["organizationDescription", "Description"],
                  ["organizationEmail", "Organization Email"],
                  ["organizationPhoneNumber", "Phone Number"],
                ].map(([k, label]) => (
                  <div key={k}>
                    <label className="label">{label}</label>
                    <input className="input" value={org.organisationDetails[k]} onChange={setOrgField("organisationDetails", k)} required />
                  </div>
                ))}
              </fieldset>

              <fieldset className="space-y-3 border-t border-gray-100 pt-4">
                <legend className="text-sm font-semibold text-gray-700 mb-2">Verification Documents</legend>
                {[
                  ["operatingLicense", "Operating License"],
                  ["organizationProofOfAddress", "Proof of Address"],
                  ["organizationCACDocument", "CAC Document"],
                  ["taxIdentificationNumber", "Tax ID Number"],
                ].map(([k, label]) => (
                  <div key={k}>
                    <label className="label">{label}</label>
                    <input className="input" value={org.organizationVerification[k]} onChange={setOrgField("organizationVerification", k)} required />
                  </div>
                ))}
              </fieldset>

              <fieldset className="space-y-3 border-t border-gray-100 pt-4">
                <legend className="text-sm font-semibold text-gray-700 mb-2">Representative</legend>
                <div>
                  <label className="label">Full Name</label>
                  <input className="input" value={org.organizationRepresentative.fullName} onChange={setOrgField("organizationRepresentative", "fullName")} required />
                </div>
                <div>
                  <label className="label">Role</label>
                  <select className="input" value={org.organizationRepresentative.role} onChange={setOrgField("organizationRepresentative", "role")}>
                    <option>HR Manager</option>
                    <option>Founder</option>
                    <option>Director</option>
                  </select>
                </div>
                <div>
                  <label className="label">Phone Number</label>
                  <input className="input" value={org.organizationRepresentative.phoneNumber} onChange={setOrgField("organizationRepresentative", "phoneNumber")} required />
                </div>
              </fieldset>
            </>
          )}

          <ErrorMsg message={error} />

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Saving…" : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
