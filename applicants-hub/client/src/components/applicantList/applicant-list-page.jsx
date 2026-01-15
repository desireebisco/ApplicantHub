import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
// import { useApplicants } from "./ApplicantContext";
import "./applicant-list-page.css";
import { useApplicants } from "../../state/ApplicantContext";

export default function ApplicantListPage() {
  const { applicants, customFields, deleteApplicant, loading, error } =
    useApplicants();
  const navigate = useNavigate();

  // Table controls
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [filterField, setFilterField] = useState("all");
  const [isDeleting, setIsDeleting] = useState(null);

  // Sort handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Get all fields (standard + custom)
  const allFields = [
    { id: "name", label: "Name" },
    { id: "address", label: "Address" },
    { id: "birthday", label: "Birthday" },
    ...customFields,
  ];

  // Filter and sort applicants
  const filteredAndSortedApplicants = useMemo(() => {
    let result = [...applicants];

    // Search filter
    if (searchTerm) {
      result = result.filter((app) => {
        return Object.values(app).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    // Field filter
    if (filterField !== "all") {
      result = result.filter(
        (app) => app[filterField] && app[filterField].trim() !== ""
      );
    }

    // Sort
    result.sort((a, b) => {
      let aVal = a[sortField] || "";
      let bVal = b[sortField] || "";

      // Convert to lowercase for string comparison
      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [applicants, searchTerm, sortField, sortDirection, filterField]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this applicant?")) {
      setIsDeleting(id);
      const result = await deleteApplicant(id);
      setIsDeleting(null);

      if (!result.success) {
        alert("Failed to delete applicant: " + result.error);
      }
    }
  };

  return (
    <div className="list-page-container">
      <div className="applicants-table-section">
        <div className="table-header">
          <div className="header-top">
            <h1>Registered Applicants</h1>
            <button onClick={() => navigate("/")} className="add-new-btn">
              + Add New Applicant
            </button>
          </div>
          <p className="applicant-count">
            Showing {filteredAndSortedApplicants.length} of {applicants.length}{" "}
            applicants
          </p>

          <div className="table-controls">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search applicants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>

            <select
              value={filterField}
              onChange={(e) => setFilterField(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Fields</option>
              {allFields.map((field) => (
                <option key={field.id} value={field.id}>
                  Has {field.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading applicants...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h2>Error Loading Data</h2>
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="retry-btn"
            >
              Retry
            </button>
          </div>
        ) : applicants.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h2>No Applicants Yet</h2>
            <p>Start by adding your first applicant</p>
            <button onClick={() => navigate("/")} className="empty-add-btn">
              Add First Applicant
            </button>
          </div>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="applicants-table">
                <thead>
                  <tr>
                    <th className="action-column">Actions</th>
                    {allFields.map((field) => (
                      <th
                        key={field.id}
                        onClick={() => handleSort(field.id)}
                        className="sortable"
                      >
                        <div className="th-content">
                          {field.label}
                          <span className="sort-indicator">
                            {sortField === field.id &&
                              (sortDirection === "asc" ? "▲" : "▼")}
                            {sortField !== field.id && "⇅"}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedApplicants.length === 0 ? (
                    <tr>
                      <td colSpan={allFields.length + 1} className="no-results">
                        No applicants found matching your criteria
                      </td>
                    </tr>
                  ) : (
                    filteredAndSortedApplicants.map((applicant) => (
                      <tr key={applicant.id}>
                        <td className="action-cell">
                          <button
                            onClick={() => handleDelete(applicant.id)}
                            className="delete-table-btn"
                            title="Delete applicant"
                            disabled={isDeleting === applicant.id}
                          >
                            {isDeleting === applicant.id ? "⏳" : "🗑️"}
                          </button>
                        </td>
                        {allFields.map((field) => (
                          <td key={field.id}>{applicant[field.id] || "-"}</td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {filteredAndSortedApplicants.length > 0 && (
              <div className="table-footer">
                <p>
                  Showing {filteredAndSortedApplicants.length} of{" "}
                  {applicants.length} applicants
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
