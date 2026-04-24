import { useEffect, useState } from "react";
import { getServices } from "../../api/services";
import { addNurseService, removeNurseService, getNurseProfile } from "../../api/nurse";
import Spinner from "../../components/Spinner";
import ErrorMsg from "../../components/ErrorMsg";

export default function NurseServices() {
  const [allServices, setAllServices] = useState([]);
  const [myServiceIds, setMyServiceIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState(null);

  const fetchData = async () => {
    try {
      const [servicesRes, profileRes] = await Promise.all([
        getServices(),
        getNurseProfile(),
      ]);
      setAllServices(servicesRes.data || []);
      const specializations =
        profileRes.data.profile?.nursingInformation?.areaOfSpecialization || [];
      setMyServiceIds(new Set(specializations.map((s) => s._id || s)));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleToggle = async (serviceId, isAdded) => {
    setActionId(serviceId);
    setError("");
    try {
      if (isAdded) {
        await removeNurseService(serviceId);
      } else {
        await addNurseService(serviceId);
      }
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Action failed");
    } finally {
      setActionId(null);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Services</h1>
        <p className="text-gray-500 mt-1">
          Toggle the services you offer to patients
        </p>
      </div>

      <ErrorMsg message={error} />

      {allServices.length === 0 ? (
        <p className="text-center text-gray-500 py-12">No services available</p>
      ) : (
        <div className="space-y-3">
          {allServices.map((s) => {
            const added = myServiceIds.has(s._id);
            const busy = actionId === s._id;
            return (
              <div
                key={s._id}
                className="card flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-gray-900">{s.title}</p>
                  {s.description && (
                    <p className="text-sm text-gray-500 mt-0.5">{s.description}</p>
                  )}
                </div>
                <button
                  onClick={() => handleToggle(s._id, added)}
                  disabled={busy}
                  className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 ml-4 ${
                    added
                      ? "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                      : "bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-200"
                  }`}
                >
                  {busy ? "…" : added ? "Remove" : "Add"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
