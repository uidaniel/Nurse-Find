import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { searchNurses, getPopularSearches } from "../../api/search";
import Spinner from "../../components/Spinner";
import ErrorMsg from "../../components/ErrorMsg";

const SORT_OPTIONS = [
  { value: "", label: "Newest" },
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Top Rated" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
];

export default function Search() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("");
  const [nurses, setNurses] = useState([]);
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getPopularSearches()
      .then((res) => setPopular(res.data.services || []))
      .catch(() => {});
  }, []);

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setError("");
    setLoading(true);
    setSearched(true);
    try {
      const { data } = await searchNurses(query.trim(), sort);
      setNurses(data.nurses || []);
    } catch (err) {
      setNurses([]);
      setError(err.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePopularClick = (title) => {
    setQuery(title);
    setTimeout(() => handleSearch(), 0);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Find a Nurse</h1>
        <p className="text-gray-500 mt-1">Search by service type to find the right care</p>
      </div>

      <form onSubmit={handleSearch} className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            className="input flex-1"
            placeholder="e.g. Home Nursing, Elderly Care…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            className="input sm:w-52"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <button type="submit" className="btn-primary sm:w-auto">
            Search
          </button>
        </div>

        {popular.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-2">Popular services:</p>
            <div className="flex flex-wrap gap-2">
              {popular.map((s) => (
                <button
                  key={s._id}
                  type="button"
                  onClick={() => handlePopularClick(s.title)}
                  className="text-xs bg-primary-50 text-primary-700 border border-primary-200 rounded-full px-3 py-1 hover:bg-primary-100 transition-colors"
                >
                  {s.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </form>

      <ErrorMsg message={error} />

      {loading && <Spinner />}

      {!loading && searched && nurses.length === 0 && !error && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-3">🔍</div>
          <p>No nurses found for &quot;{query}&quot;</p>
        </div>
      )}

      {nurses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nurses.map((profile) => (
            <div key={profile._id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-lg shrink-0">
                  {profile.user?.name?.[0]?.toUpperCase() || "N"}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {profile.user?.name || "Nurse"}
                  </h3>
                  <p className="text-sm text-gray-500">{profile.user?.email}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {profile.pricePerHour != null && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Rate</span>
                    <span className="font-semibold text-gray-900">${profile.pricePerHour}/hr</span>
                  </div>
                )}
                {profile.rating != null && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Rating</span>
                    <span className="font-semibold text-gray-900">⭐ {profile.rating}</span>
                  </div>
                )}
                {profile.services?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {profile.services.map((s) => (
                      <span
                        key={s._id}
                        className="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5"
                      >
                        {s.title}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => navigate("/bookings/create", { state: { nurseUserId: profile.user?._id, nurseName: profile.user?.name } })}
                className="btn-primary w-full mt-4 text-sm"
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
