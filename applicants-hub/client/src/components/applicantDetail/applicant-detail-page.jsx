import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./applicant-detail-page.css";
import { useApplicants } from "../../state/ApplicantContext";

export default function ApplicantDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { applicants, customFields, deleteApplicant, updateApplicant } =
    useApplicants();

  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Find the applicant by ID
  const applicant = applicants.find((app) => app.id === parseInt(id));

  // Get all fields (standard + custom)
  const allFields = [
    { id: "name", label: "Name", icon: "👤" },
    { id: "address", label: "Address", icon: "📍" },
    { id: "birthday", label: "Birthday", icon: "🎂" },
    ...customFields.map((field) => ({ ...field, icon: "📝" })),
  ];

  // If applicant not found
  if (!applicant) {
    return (
      <div className="detail-page-container">
        <div className="detail-not-found">
          <div className="not-found-icon">🔍</div>
          <h1>Applicant Not Found</h1>
          <p>
            The applicant you're looking for doesn't exist or has been removed.
          </p>
          <button onClick={() => navigate("/applicants")} className="back-btn">
            ← Back to Applicants List
          </button>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    setEditFormData({ ...applicant });
    setIsEditing(true);
    setUpdateError(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData({});
    setUpdateError(null);
  };

  const handleEditChange = (field, value) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveEdit = async () => {
    setIsUpdating(true);
    setUpdateError(null);

    try {
      const result = await updateApplicant(applicant.id, editFormData);

      if (result.success) {
        setIsEditing(false);
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

  const handleDelete = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${applicant.name}? This action cannot be undone.`
      )
    ) {
      setIsDeleting(true);
      const result = await deleteApplicant(applicant.id);

      if (result.success) {
        navigate("/applicants");
      } else {
        alert("Failed to delete applicant: " + result.error);
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="detail-page-container">
      <div className="detail-content">
        {/* Header */}
        <div className="detail-header">
          <button
            onClick={() => navigate("/applicants")}
            className="back-btn-simple"
          >
            ← Back
          </button>

          <div className="header-actions">
            {!isEditing && (
              <>
                <button onClick={handleEdit} className="edit-btn">
                  ✏️ Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="delete-btn-detail"
                  disabled={isDeleting}
                >
                  {isDeleting ? "⏳ Deleting..." : "🗑️ Delete"}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Applicant Card */}
        <div className="applicant-detail-card">
          <div className="card-header">
            <div className="applicant-avatar">
              {applicant.name.charAt(0).toUpperCase()}
            </div>
            <div className="applicant-title">
              <h1>{applicant.name}</h1>
              <p className="applicant-id">ID: {applicant.id}</p>
            </div>
          </div>

          {updateError && (
            <div className="error-message-detail">✗ {updateError}</div>
          )}

          {/* Fields Display/Edit */}
          <div className="applicant-fields">
            {allFields.map((field) => {
              const value = applicant[field.id];

              // Skip fields that don't have values and we're not editing
              if (!value && !isEditing) return null;

              return (
                <div key={field.id} className="detail-field">
                  <div className="field-label">
                    <span className="field-icon">{field.icon}</span>
                    {field.label}
                  </div>

                  {isEditing ? (
                    <div className="field-edit">
                      {field.type === "textarea" ? (
                        <textarea
                          value={editFormData[field.id] || ""}
                          onChange={(e) =>
                            handleEditChange(field.id, e.target.value)
                          }
                          rows="3"
                          className="field-textarea"
                        />
                      ) : (
                        <input
                          type={field.type || "text"}
                          value={editFormData[field.id] || ""}
                          onChange={(e) =>
                            handleEditChange(field.id, e.target.value)
                          }
                          className="field-input"
                        />
                      )}
                    </div>
                  ) : (
                    <div className="field-value">{value || "-"}</div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Edit Actions */}
          {isEditing && (
            <div className="edit-actions">
              <button
                onClick={handleCancelEdit}
                className="cancel-edit-btn"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="save-edit-btn"
                disabled={isUpdating}
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="applicant-metadata">
          <div className="metadata-item">
            <span className="metadata-label">Created:</span>
            <span className="metadata-value">
              {new Date(applicant.id).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
