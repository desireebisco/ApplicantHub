import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./applicant-list-page.css";
import { useApplicants } from "../../state/ApplicantContext";

export default function ApplicantListPage() {
  const {
    applicants,
    customFields,
    deleteApplicant,
    updateApplicant,
    loading,
    error,
  } = useApplicants();
  const navigate = useNavigate();

  // Table controls
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [filterField, setFilterField] = useState("all");
  const [isDeleting, setIsDeleting] = useState(null);

  // Edit modal state
  const [editingApplicant, setEditingApplicant] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);

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
    { id: "street_address", label: "Street Address" },
    { id: "barangay", label: "Barangay" },
    { id: "city", label: "City" },
    { id: "province", label: "Province" },
    { id: "postal_code", label: "Postal Code" },
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

  const handleEdit = (applicant) => {
    setEditingApplicant(applicant);
    setEditFormData({ ...applicant });
    setUpdateError(null);
  };

  const handleEditChange = (field, value) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCancelEdit = () => {
    setEditingApplicant(null);
    setEditFormData({});
    setUpdateError(null);
  };

  const handleSaveEdit = async () => {
    setIsUpdating(true);
    setUpdateError(null);

    try {
      const result = await updateApplicant(editingApplicant.id, editFormData);

      if (result.success) {
        setEditingApplicant(null);
        setEditFormData({});
      } else {
        setUpdateError(result.error || "Failed to update applicant");
      }
    } catch (error) {
      setUpdateError("An unexpected error occurred");
    } finally {
      setIsUpdating(false);
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
                            onClick={() => handleEdit(applicant)}
                            className="edit-table-btn"
                            title="Edit applicant"
                          >
                            ✏️
                          </button>
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
                          <td key={field.id}>
                            {field.id === "name" ? (
                              <button
                                onClick={() =>
                                  navigate(`/applicants/${applicant.id}`)
                                }
                                className="name-link"
                              >
                                {applicant[field.id] || "-"}
                              </button>
                            ) : (
                              applicant[field.id] || "-"
                            )}
                          </td>
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

      {/* Edit Modal */}
      {editingApplicant && (
        <div className="modal-overlay" onClick={handleCancelEdit}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Applicant</h2>
              <button onClick={handleCancelEdit} className="modal-close-btn">
                ×
              </button>
            </div>

            <div className="modal-body">
              {updateError && (
                <div className="error-message-modal">✗ {updateError}</div>
              )}

              <div className="edit-form">
                {allFields.map((field) => (
                  <div key={field.id} className="edit-form-group">
                    <label htmlFor={`edit-${field.id}`}>{field.label}</label>
                    {field.id === "street_address" ? (
                      <input
                        type="text"
                        id={`edit-${field.id}`}
                        value={editFormData[field.id] || ""}
                        onChange={(e) =>
                          handleEditChange(field.id, e.target.value)
                        }
                        placeholder="House/Building No., Street Name"
                      />
                    ) : field.type === "textarea" ? (
                      <textarea
                        id={`edit-${field.id}`}
                        value={editFormData[field.id] || ""}
                        onChange={(e) =>
                          handleEditChange(field.id, e.target.value)
                        }
                        rows="3"
                      />
                    ) : (
                      <input
                        type={field.type || "text"}
                        id={`edit-${field.id}`}
                        value={editFormData[field.id] || ""}
                        onChange={(e) =>
                          handleEditChange(field.id, e.target.value)
                        }
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button
                onClick={handleCancelEdit}
                className="modal-cancel-btn"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="modal-save-btn"
                disabled={isUpdating}
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
