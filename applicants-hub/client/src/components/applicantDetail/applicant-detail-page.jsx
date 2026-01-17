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

  // Get all fields organized by section
  const personalFields = [
    { id: "first_name", label: "First Name", icon: "👤" },
    { id: "middle_name", label: "Middle Name", icon: "👤" },
    { id: "last_name", label: "Last Name", icon: "👤" },
    { id: "gender", label: "Gender", icon: "⚧️" },
    { id: "date_of_birth", label: "Date of Birth", icon: "📅" },
    { id: "age", label: "Age", icon: "🎂" },
    { id: "nationality", label: "Nationality", icon: "🌍" },
    { id: "civil_status", label: "Civil Status", icon: "💍" },
  ];

  const jobFields = [
    { id: "job_applied_for", label: "Job Applied For", icon: "💼" },
    {
      id: "country_of_destination",
      label: "Country of Destination",
      icon: "✈️",
    },
  ];

  const contactFields = [
    { id: "contact_number_1", label: "Contact Number 1", icon: "📞" },
    { id: "contact_number_2", label: "Contact Number 2", icon: "📞" },
    { id: "email", label: "Email", icon: "📧" },
    { id: "social_media_fb", label: "Facebook", icon: "👥" },
    { id: "social_media_tiktok", label: "TikTok", icon: "🎵" },
    { id: "social_media_ig", label: "Instagram", icon: "📸" },
  ];

  const addressFields = [
    { id: "street_address", label: "Street Address", icon: "🏠" },
    { id: "barangay", label: "Barangay", icon: "📍" },
    { id: "city", label: "City/Municipality", icon: "🏙️" },
    { id: "province", label: "Province", icon: "🗺️" },
    { id: "postal_code", label: "Postal Code", icon: "📮" },
  ];

  const emergencyFields = [
    { id: "emergency_contact_name", label: "Contact Person", icon: "🆘" },
    { id: "emergency_contact_number", label: "Contact Number", icon: "📞" },
    { id: "emergency_contact_fb", label: "Facebook", icon: "👥" },
    { id: "emergency_contact_tiktok", label: "TikTok", icon: "🎵" },
    { id: "emergency_contact_ig", label: "Instagram", icon: "📸" },
    { id: "emergency_contact_street", label: "Street", icon: "🏠" },
    { id: "emergency_contact_barangay", label: "Barangay", icon: "📍" },
    { id: "emergency_contact_city", label: "City", icon: "🏙️" },
    { id: "emergency_contact_province", label: "Province", icon: "🗺️" },
    { id: "emergency_contact_postal", label: "Postal Code", icon: "📮" },
  ];

  const workFields = [
    { id: "work_country", label: "Country", icon: "🌍" },
    { id: "years_of_experience", label: "Years of Experience", icon: "⏱️" },
    { id: "job_position", label: "Position", icon: "💼" },
  ];

  const remarksFields = [{ id: "remarks", label: "Remarks", icon: "📝" }];

  const allFieldSections = [
    { title: "Job Information", fields: jobFields },
    { title: "Personal Information", fields: personalFields },
    { title: "Contact Information", fields: contactFields },
    { title: "Address", fields: addressFields },
    { title: "Emergency Contact", fields: emergencyFields },
    { title: "Work Experience", fields: workFields },
    { title: "Additional Notes", fields: remarksFields },
    {
      title: "Custom Fields",
      fields: customFields.map((field) => ({ ...field, icon: "📝" })),
    },
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
    const fullName = `${applicant.first_name} ${applicant.last_name}`;
    if (
      window.confirm(
        `Are you sure you want to delete ${fullName}? This action cannot be undone.`
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
              {applicant.first_name
                ? applicant.first_name.charAt(0).toUpperCase()
                : "A"}
            </div>
            <div className="applicant-title">
              <h1>
                {applicant.first_name} {applicant.middle_name}{" "}
                {applicant.last_name}
              </h1>
              <p className="applicant-id">ID: {applicant.id}</p>
            </div>
          </div>

          {updateError && (
            <div className="error-message-detail">✗ {updateError}</div>
          )}

          {/* Fields Display/Edit */}
          <div className="applicant-fields">
            {allFieldSections.map((section) => {
              // Skip empty sections
              const hasData = section.fields.some(
                (field) => applicant[field.id]
              );
              if (!hasData && !isEditing) return null;

              return (
                <div key={section.title} className="field-section">
                  <h3 className="field-section-title">{section.title}</h3>
                  {section.fields.map((field) => {
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
                            {field.type === "textarea" ||
                            field.id === "remarks" ? (
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

        {/* Documents Section */}
        {applicant.documents && (
          <div className="documents-card">
            <h2 className="documents-title">📄 Uploaded Documents</h2>
            <div className="documents-grid">
              {applicant.documents.resume && (
                <div className="document-item">
                  <div className="document-icon">📄</div>
                  <div className="document-info">
                    <div className="document-name">
                      {applicant.documents.resume.name}
                    </div>
                    <div className="document-meta">
                      <span className="document-size">
                        {applicant.documents.resume.size}
                      </span>
                      <span className="document-date">
                        Uploaded: {applicant.documents.resume.uploadDate}
                      </span>
                    </div>
                  </div>
                  <button className="document-download" title="Download">
                    ⬇️
                  </button>
                </div>
              )}

              {applicant.documents.application_form && (
                <div className="document-item">
                  <div className="document-icon">📋</div>
                  <div className="document-info">
                    <div className="document-name">
                      {applicant.documents.application_form.name}
                    </div>
                    <div className="document-meta">
                      <span className="document-size">
                        {applicant.documents.application_form.size}
                      </span>
                      <span className="document-date">
                        Uploaded:{" "}
                        {applicant.documents.application_form.uploadDate}
                      </span>
                    </div>
                  </div>
                  <button className="document-download" title="Download">
                    ⬇️
                  </button>
                </div>
              )}

              {applicant.documents.ids_passport && (
                <div className="document-item">
                  <div className="document-icon">🪪</div>
                  <div className="document-info">
                    <div className="document-name">
                      {applicant.documents.ids_passport.name}
                    </div>
                    <div className="document-meta">
                      <span className="document-size">
                        {applicant.documents.ids_passport.size}
                      </span>
                      <span className="document-date">
                        Uploaded: {applicant.documents.ids_passport.uploadDate}
                      </span>
                    </div>
                  </div>
                  <button className="document-download" title="Download">
                    ⬇️
                  </button>
                </div>
              )}

              {applicant.documents.medical_results && (
                <div className="document-item">
                  <div className="document-icon">🏥</div>
                  <div className="document-info">
                    <div className="document-name">
                      {applicant.documents.medical_results.name}
                    </div>
                    <div className="document-meta">
                      <span className="document-size">
                        {applicant.documents.medical_results.size}
                      </span>
                      <span className="document-date">
                        Uploaded:{" "}
                        {applicant.documents.medical_results.uploadDate}
                      </span>
                    </div>
                  </div>
                  <button className="document-download" title="Download">
                    ⬇️
                  </button>
                </div>
              )}

              {applicant.documents.signed_contracts && (
                <div className="document-item">
                  <div className="document-icon">📝</div>
                  <div className="document-info">
                    <div className="document-name">
                      {applicant.documents.signed_contracts.name}
                    </div>
                    <div className="document-meta">
                      <span className="document-size">
                        {applicant.documents.signed_contracts.size}
                      </span>
                      <span className="document-date">
                        Uploaded:{" "}
                        {applicant.documents.signed_contracts.uploadDate}
                      </span>
                    </div>
                  </div>
                  <button className="document-download" title="Download">
                    ⬇️
                  </button>
                </div>
              )}

              {applicant.documents.visa_copy && (
                <div className="document-item">
                  <div className="document-icon">✈️</div>
                  <div className="document-info">
                    <div className="document-name">
                      {applicant.documents.visa_copy.name}
                    </div>
                    <div className="document-meta">
                      <span className="document-size">
                        {applicant.documents.visa_copy.size}
                      </span>
                      <span className="document-date">
                        Uploaded: {applicant.documents.visa_copy.uploadDate}
                      </span>
                    </div>
                  </div>
                  <button className="document-download" title="Download">
                    ⬇️
                  </button>
                </div>
              )}

              {applicant.documents.other_documents && (
                <div className="document-item">
                  <div className="document-icon">📦</div>
                  <div className="document-info">
                    <div className="document-name">
                      {applicant.documents.other_documents.name}
                    </div>
                    <div className="document-meta">
                      <span className="document-size">
                        {applicant.documents.other_documents.size}
                      </span>
                      <span className="document-date">
                        Uploaded:{" "}
                        {applicant.documents.other_documents.uploadDate}
                      </span>
                    </div>
                  </div>
                  <button className="document-download" title="Download">
                    ⬇️
                  </button>
                </div>
              )}
            </div>

            {!applicant.documents.resume &&
              !applicant.documents.application_form &&
              !applicant.documents.ids_passport &&
              !applicant.documents.medical_results &&
              !applicant.documents.signed_contracts &&
              !applicant.documents.visa_copy &&
              !applicant.documents.other_documents && (
                <div className="no-documents">
                  <p>No documents uploaded yet</p>
                </div>
              )}
          </div>
        )}

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
