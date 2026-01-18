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
  const [editDocuments, setEditDocuments] = useState({});
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

  // Get all fields (standard + custom) - showing key fields only in table
  const allFields = [
    { id: "first_name", label: "First Name" },
    { id: "last_name", label: "Last Name" },
    { id: "job_applied_for", label: "Job Applied" },
    { id: "country_of_destination", label: "Destination" },
    { id: "gender", label: "Gender" },
    { id: "age", label: "Age" },
    { id: "contact_number_1", label: "Contact" },
    { id: "email", label: "Email" },
    { id: "city", label: "City" },
    { id: "civil_status", label: "Status" },
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
    setEditDocuments(applicant.documents ? { ...applicant.documents } : {});
    setUpdateError(null);
  };

  const handleEditChange = (field, value) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateOfBirthChange = (value) => {
    const calculateAge = (dateOfBirth) => {
      if (!dateOfBirth) return "";
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      return age;
    };

    setEditFormData((prev) => ({
      ...prev,
      date_of_birth: value,
      age: calculateAge(value),
    }));
  };

  const handleDocumentUpload = (e, docType) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const fileObjects = files.map((file) => ({
        name: file.name,
        size: `${(file.size / 1024).toFixed(0)} KB`,
        type: file.type,
        uploadDate: new Date().toISOString().split("T")[0],
        file: file,
      }));

      setEditDocuments((prev) => ({
        ...prev,
        [docType]: prev[docType]
          ? [...prev[docType], ...fileObjects]
          : fileObjects,
      }));
    }
  };

  const handleDeleteDocument = (docType, fileIndex) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      setEditDocuments((prev) => {
        const files = prev[docType];
        if (Array.isArray(files)) {
          const updated = files.filter((_, index) => index !== fileIndex);
          return {
            ...prev,
            [docType]: updated.length > 0 ? updated : null,
          };
        }
        return {
          ...prev,
          [docType]: null,
        };
      });
    }
  };

  // Helper to render document upload field
  const renderDocumentField = (
    docType,
    label,
    icon,
    accept,
    required = false,
    fullWidth = false
  ) => {
    const documents = editDocuments[docType];
    const hasFiles =
      documents && (Array.isArray(documents) ? documents.length > 0 : true);

    return (
      <div
        className={`edit-document-item ${
          fullWidth ? "edit-document-full-width" : ""
        }`}
      >
        <label>
          {label} {required && "*"}
        </label>

        {/* Show uploaded files */}
        {hasFiles && (
          <div className="uploaded-files-list">
            {(Array.isArray(documents) ? documents : [documents]).map(
              (doc, index) => (
                <div key={index} className="edit-doc-preview">
                  <span className="doc-preview-name">
                    {icon} {doc.name}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteDocument(
                        docType,
                        Array.isArray(documents) ? index : null
                      )
                    }
                    className="doc-preview-delete"
                    title="Delete file"
                  >
                    ×
                  </button>
                </div>
              )
            )}
          </div>
        )}

        {/* Upload button */}
        <label className="edit-file-upload">
          <input
            type="file"
            onChange={(e) => handleDocumentUpload(e, docType)}
            accept={accept}
            multiple
            style={{ display: "none" }}
          />
          <span className="upload-placeholder">
            📤 {hasFiles ? "Add more files" : "Click to upload"}
          </span>
        </label>
      </div>
    );
  };

  const handleCancelEdit = () => {
    setEditingApplicant(null);
    setEditFormData({});
    setEditDocuments({});
    setUpdateError(null);
  };

  const handleSaveEdit = async () => {
    setIsUpdating(true);
    setUpdateError(null);

    try {
      const updatedData = {
        ...editFormData,
        documents: editDocuments,
      };

      const result = await updateApplicant(editingApplicant.id, updatedData);

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
            <button
              onClick={() => navigate("/add-applicant")}
              className="add-new-btn"
            >
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
            <button
              onClick={() => navigate("/add-applicant")}
              className="empty-add-btn"
            >
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
                            {field.id === "first_name" ? (
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
          <div
            className="modal-content-large"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>
                Edit Applicant - {editFormData.first_name}{" "}
                {editFormData.last_name}
              </h2>
              <button onClick={handleCancelEdit} className="modal-close-btn">
                ×
              </button>
            </div>

            <div className="modal-body-large">
              {updateError && (
                <div className="error-message-modal">✗ {updateError}</div>
              )}

              <div className="edit-form-comprehensive">
                {/* Job Information */}
                <div className="edit-section">
                  <h3 className="edit-section-title">Job Information</h3>
                  <div className="edit-form-row">
                    <div className="edit-form-group">
                      <label>Job Applied For *</label>
                      <input
                        type="text"
                        value={editFormData.job_applied_for || ""}
                        onChange={(e) =>
                          handleEditChange("job_applied_for", e.target.value)
                        }
                        placeholder="Enter job position"
                      />
                    </div>
                    <div className="edit-form-group">
                      <label>Country of Destination *</label>
                      <input
                        type="text"
                        value={editFormData.country_of_destination || ""}
                        onChange={(e) =>
                          handleEditChange(
                            "country_of_destination",
                            e.target.value
                          )
                        }
                        placeholder="Enter country"
                      />
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="edit-section">
                  <h3 className="edit-section-title">Personal Information</h3>
                  <div className="edit-form-row edit-form-row-three">
                    <div className="edit-form-group">
                      <label>First Name *</label>
                      <input
                        type="text"
                        value={editFormData.first_name || ""}
                        onChange={(e) =>
                          handleEditChange("first_name", e.target.value)
                        }
                        placeholder="First name"
                        required
                      />
                    </div>
                    <div className="edit-form-group">
                      <label>Middle Name</label>
                      <input
                        type="text"
                        value={editFormData.middle_name || ""}
                        onChange={(e) =>
                          handleEditChange("middle_name", e.target.value)
                        }
                        placeholder="Middle name"
                      />
                    </div>
                    <div className="edit-form-group">
                      <label>Last Name *</label>
                      <input
                        type="text"
                        value={editFormData.last_name || ""}
                        onChange={(e) =>
                          handleEditChange("last_name", e.target.value)
                        }
                        placeholder="Last name"
                        required
                      />
                    </div>
                  </div>

                  <div className="edit-form-row">
                    <div className="edit-form-group">
                      <label>Gender *</label>
                      <select
                        value={editFormData.gender || ""}
                        onChange={(e) =>
                          handleEditChange("gender", e.target.value)
                        }
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div className="edit-form-group">
                      <label>Date of Birth *</label>
                      <input
                        type="date"
                        value={editFormData.date_of_birth || ""}
                        onChange={(e) =>
                          handleDateOfBirthChange(e.target.value)
                        }
                      />
                    </div>
                    <div className="edit-form-group">
                      <label>Age</label>
                      <input
                        type="text"
                        value={editFormData.age || ""}
                        readOnly
                        placeholder="Auto-calculated"
                        className="readonly-field"
                      />
                    </div>
                  </div>

                  <div className="edit-form-row">
                    <div className="edit-form-group">
                      <label>Nationality *</label>
                      <input
                        type="text"
                        value={editFormData.nationality || ""}
                        onChange={(e) =>
                          handleEditChange("nationality", e.target.value)
                        }
                        placeholder="Enter nationality"
                      />
                    </div>
                    <div className="edit-form-group">
                      <label>Civil Status *</label>
                      <select
                        value={editFormData.civil_status || ""}
                        onChange={(e) =>
                          handleEditChange("civil_status", e.target.value)
                        }
                      >
                        <option value="">Select civil status</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Widowed">Widowed</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Separated">Separated</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="edit-section">
                  <h3 className="edit-section-title">Contact Information</h3>
                  <div className="edit-form-row">
                    <div className="edit-form-group">
                      <label>Contact Number 1 *</label>
                      <input
                        type="tel"
                        value={editFormData.contact_number_1 || ""}
                        onChange={(e) =>
                          handleEditChange("contact_number_1", e.target.value)
                        }
                        placeholder="+63 XXX XXX XXXX"
                      />
                    </div>
                    <div className="edit-form-group">
                      <label>Contact Number 2</label>
                      <input
                        type="tel"
                        value={editFormData.contact_number_2 || ""}
                        onChange={(e) =>
                          handleEditChange("contact_number_2", e.target.value)
                        }
                        placeholder="+63 XXX XXX XXXX"
                      />
                    </div>
                  </div>

                  <div className="edit-form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      value={editFormData.email || ""}
                      onChange={(e) =>
                        handleEditChange("email", e.target.value)
                      }
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div className="edit-form-row edit-form-row-three">
                    <div className="edit-form-group">
                      <label>Facebook Account</label>
                      <input
                        type="text"
                        value={editFormData.social_media_fb || ""}
                        onChange={(e) =>
                          handleEditChange("social_media_fb", e.target.value)
                        }
                        placeholder="Facebook username/URL"
                      />
                    </div>
                    <div className="edit-form-group">
                      <label>TikTok Account</label>
                      <input
                        type="text"
                        value={editFormData.social_media_tiktok || ""}
                        onChange={(e) =>
                          handleEditChange(
                            "social_media_tiktok",
                            e.target.value
                          )
                        }
                        placeholder="TikTok username"
                      />
                    </div>
                    <div className="edit-form-group">
                      <label>Instagram Account</label>
                      <input
                        type="text"
                        value={editFormData.social_media_ig || ""}
                        onChange={(e) =>
                          handleEditChange("social_media_ig", e.target.value)
                        }
                        placeholder="Instagram username"
                      />
                    </div>
                  </div>
                </div>

                {/* Full Address */}
                <div className="edit-section">
                  <h3 className="edit-section-title">Full Address</h3>
                  <div className="edit-form-group">
                    <label>Street Address *</label>
                    <input
                      type="text"
                      value={editFormData.street_address || ""}
                      onChange={(e) =>
                        handleEditChange("street_address", e.target.value)
                      }
                      placeholder="House/Building No., Street Name"
                    />
                  </div>

                  <div className="edit-form-row">
                    <div className="edit-form-group">
                      <label>Barangay *</label>
                      <input
                        type="text"
                        value={editFormData.barangay || ""}
                        onChange={(e) =>
                          handleEditChange("barangay", e.target.value)
                        }
                        placeholder="Enter barangay"
                      />
                    </div>
                    <div className="edit-form-group">
                      <label>City/Municipality *</label>
                      <input
                        type="text"
                        value={editFormData.city || ""}
                        onChange={(e) =>
                          handleEditChange("city", e.target.value)
                        }
                        placeholder="Enter city/municipality"
                      />
                    </div>
                  </div>

                  <div className="edit-form-row">
                    <div className="edit-form-group">
                      <label>Province *</label>
                      <input
                        type="text"
                        value={editFormData.province || ""}
                        onChange={(e) =>
                          handleEditChange("province", e.target.value)
                        }
                        placeholder="Enter province"
                      />
                    </div>
                    <div className="edit-form-group">
                      <label>Postal Code</label>
                      <input
                        type="text"
                        value={editFormData.postal_code || ""}
                        onChange={(e) =>
                          handleEditChange("postal_code", e.target.value)
                        }
                        placeholder="Enter postal code"
                      />
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="edit-section">
                  <h3 className="edit-section-title">
                    Emergency Contact Details
                  </h3>
                  <div className="edit-form-row">
                    <div className="edit-form-group">
                      <label>Contact Person Name *</label>
                      <input
                        type="text"
                        value={editFormData.emergency_contact_name || ""}
                        onChange={(e) =>
                          handleEditChange(
                            "emergency_contact_name",
                            e.target.value
                          )
                        }
                        placeholder="Full name"
                      />
                    </div>
                    <div className="edit-form-group">
                      <label>Contact Number *</label>
                      <input
                        type="tel"
                        value={editFormData.emergency_contact_number || ""}
                        onChange={(e) =>
                          handleEditChange(
                            "emergency_contact_number",
                            e.target.value
                          )
                        }
                        placeholder="+63 XXX XXX XXXX"
                      />
                    </div>
                  </div>

                  <div className="edit-form-row edit-form-row-three">
                    <div className="edit-form-group">
                      <label>Facebook</label>
                      <input
                        type="text"
                        value={editFormData.emergency_contact_fb || ""}
                        onChange={(e) =>
                          handleEditChange(
                            "emergency_contact_fb",
                            e.target.value
                          )
                        }
                        placeholder="Facebook username/URL"
                      />
                    </div>
                    <div className="edit-form-group">
                      <label>TikTok</label>
                      <input
                        type="text"
                        value={editFormData.emergency_contact_tiktok || ""}
                        onChange={(e) =>
                          handleEditChange(
                            "emergency_contact_tiktok",
                            e.target.value
                          )
                        }
                        placeholder="TikTok username"
                      />
                    </div>
                    <div className="edit-form-group">
                      <label>Instagram</label>
                      <input
                        type="text"
                        value={editFormData.emergency_contact_ig || ""}
                        onChange={(e) =>
                          handleEditChange(
                            "emergency_contact_ig",
                            e.target.value
                          )
                        }
                        placeholder="Instagram username"
                      />
                    </div>
                  </div>

                  <h4 className="edit-subsection-title">
                    Emergency Contact Address
                  </h4>

                  <div className="edit-form-group">
                    <label>Street Address</label>
                    <input
                      type="text"
                      value={editFormData.emergency_contact_street || ""}
                      onChange={(e) =>
                        handleEditChange(
                          "emergency_contact_street",
                          e.target.value
                        )
                      }
                      placeholder="House/Building No., Street Name"
                    />
                  </div>

                  <div className="edit-form-row">
                    <div className="edit-form-group">
                      <label>Barangay</label>
                      <input
                        type="text"
                        value={editFormData.emergency_contact_barangay || ""}
                        onChange={(e) =>
                          handleEditChange(
                            "emergency_contact_barangay",
                            e.target.value
                          )
                        }
                        placeholder="Enter barangay"
                      />
                    </div>
                    <div className="edit-form-group">
                      <label>City/Municipality</label>
                      <input
                        type="text"
                        value={editFormData.emergency_contact_city || ""}
                        onChange={(e) =>
                          handleEditChange(
                            "emergency_contact_city",
                            e.target.value
                          )
                        }
                        placeholder="Enter city/municipality"
                      />
                    </div>
                  </div>

                  <div className="edit-form-row">
                    <div className="edit-form-group">
                      <label>Province</label>
                      <input
                        type="text"
                        value={editFormData.emergency_contact_province || ""}
                        onChange={(e) =>
                          handleEditChange(
                            "emergency_contact_province",
                            e.target.value
                          )
                        }
                        placeholder="Enter province"
                      />
                    </div>
                    <div className="edit-form-group">
                      <label>Postal Code</label>
                      <input
                        type="text"
                        value={editFormData.emergency_contact_postal || ""}
                        onChange={(e) =>
                          handleEditChange(
                            "emergency_contact_postal",
                            e.target.value
                          )
                        }
                        placeholder="Enter postal code"
                      />
                    </div>
                  </div>
                </div>

                {/* Work Experience */}
                <div className="edit-section">
                  <h3 className="edit-section-title">Work Experience</h3>
                  <div className="edit-form-row edit-form-row-three">
                    <div className="edit-form-group">
                      <label>Country *</label>
                      <input
                        type="text"
                        value={editFormData.work_country || ""}
                        onChange={(e) =>
                          handleEditChange("work_country", e.target.value)
                        }
                        placeholder="Country of work"
                      />
                    </div>
                    <div className="edit-form-group">
                      <label>Years of Experience *</label>
                      <input
                        type="number"
                        value={editFormData.years_of_experience || ""}
                        onChange={(e) =>
                          handleEditChange(
                            "years_of_experience",
                            e.target.value
                          )
                        }
                        min="0"
                        step="0.5"
                        placeholder="Years"
                      />
                    </div>
                    <div className="edit-form-group">
                      <label>Job Position *</label>
                      <input
                        type="text"
                        value={editFormData.job_position || ""}
                        onChange={(e) =>
                          handleEditChange("job_position", e.target.value)
                        }
                        placeholder="Position held"
                      />
                    </div>
                  </div>
                </div>

                {/* Documents Upload */}
                <div className="edit-section">
                  <h3 className="edit-section-title">📄 Document Uploads</h3>
                  <p className="section-description">
                    Accepted formats: PDF, Word, Excel, Images (JPG, PNG),
                    Videos (MP4, MOV). Multiple files allowed per category.
                  </p>
                  <div className="edit-documents-grid">
                    {renderDocumentField(
                      "resume",
                      "Resume / CV",
                      "📄",
                      ".pdf,.doc,.docx,image/*",
                      true
                    )}
                    {renderDocumentField(
                      "application_form",
                      "Application Form",
                      "📋",
                      ".pdf,.doc,.docx,image/*"
                    )}
                    {renderDocumentField(
                      "ids_passport",
                      "IDs and Passport",
                      "🪪",
                      ".pdf,image/*",
                      true
                    )}
                    {renderDocumentField(
                      "medical_results",
                      "Medical Results",
                      "🏥",
                      ".pdf,.doc,.docx,image/*"
                    )}
                    {renderDocumentField(
                      "signed_contracts",
                      "Signed Contracts",
                      "📝",
                      ".pdf,.doc,.docx"
                    )}
                    {renderDocumentField(
                      "visa_copy",
                      "Visa Copy",
                      "✈️",
                      ".pdf,image/*"
                    )}
                    {renderDocumentField(
                      "other_documents",
                      "Other Required Documents",
                      "📦",
                      ".pdf,.doc,.docx,.xls,.xlsx,image/*,video/*",
                      false,
                      true
                    )}
                  </div>
                  <p className="field-hint">
                    Note: You can upload multiple files for each category. Files
                    will be added to the existing uploads.
                  </p>
                </div>

                {/* Remarks */}
                <div className="edit-section">
                  <h3 className="edit-section-title">Remarks</h3>
                  <div className="edit-form-group">
                    <label>Additional Notes</label>
                    <textarea
                      value={editFormData.remarks || ""}
                      onChange={(e) =>
                        handleEditChange("remarks", e.target.value)
                      }
                      rows="5"
                      placeholder="Enter any additional remarks or notes..."
                    />
                  </div>
                </div>
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
