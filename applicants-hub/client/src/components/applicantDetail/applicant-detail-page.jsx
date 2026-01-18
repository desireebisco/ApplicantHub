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

  // Document viewer state
  const [viewingDocument, setViewingDocument] = useState(null);

  // Document edit state
  const [editDocuments, setEditDocuments] = useState({});

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

  // Helper function to render document items
  const renderDocumentItem = (
    docKey,
    icon,
    label,
    accept = ".pdf,.doc,.docx,image/*"
  ) => {
    const currentDoc = editDocuments[docKey] || applicant.documents[docKey];
    const shouldShow = isEditing || currentDoc;

    if (!shouldShow) return null;

    return (
      <div className="document-item" key={docKey}>
        <div className="document-icon">{icon}</div>
        <div className="document-info">
          <div className="document-label">{label}</div>
          {currentDoc ? (
            <>
              <div className="document-name">{currentDoc.name}</div>
              <div className="document-meta">
                <span className="document-size">{currentDoc.size}</span>
                <span className="document-date">
                  Uploaded: {currentDoc.uploadDate}
                </span>
              </div>
            </>
          ) : (
            <div className="document-empty">No file uploaded</div>
          )}
        </div>
        {isEditing ? (
          <div className="document-edit-actions">
            <label className="document-upload-btn" title="Upload new file">
              📤
              <input
                type="file"
                onChange={(e) => handleDocumentUpload(e, docKey)}
                accept={accept}
                style={{ display: "none" }}
              />
            </label>
            {currentDoc && (
              <button
                className="document-delete-btn"
                onClick={() => handleDeleteDocument(docKey)}
                title="Delete file"
              >
                🗑️
              </button>
            )}
          </div>
        ) : (
          currentDoc && (
            <div className="document-actions">
              <button
                className="document-view"
                onClick={() => handleViewDocument(currentDoc, label)}
                title="View"
              >
                👁️
              </button>
              <button className="document-download" title="Download">
                ⬇️
              </button>
            </div>
          )
        )}
      </div>
    );
  };

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
    setEditDocuments({ ...applicant.documents });
    setIsEditing(true);
    setUpdateError(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData({});
    setEditDocuments({});
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
      const updatedData = {
        ...editFormData,
        documents: editDocuments,
      };

      const result = await updateApplicant(applicant.id, updatedData);

      if (result.success) {
        setIsEditing(false);
        setEditFormData({});
        setEditDocuments({});
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

  const handleViewDocument = (document, type) => {
    setViewingDocument({ ...document, type });
  };

  const handleCloseViewer = () => {
    setViewingDocument(null);
  };

  const handlePrintDocument = () => {
    // In production, this would print the actual document
    // For now, we'll use the browser's print dialog with the preview
    window.print();
  };

  const handleDocumentUpload = (e, docType) => {
    const file = e.target.files[0];
    if (file) {
      setEditDocuments((prev) => ({
        ...prev,
        [docType]: {
          name: file.name,
          size: `${(file.size / 1024).toFixed(0)} KB`,
          type: file.type,
          uploadDate: new Date().toISOString().split("T")[0],
          file: file,
        },
      }));
    }
  };

  const handleDeleteDocument = (docType) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      setEditDocuments((prev) => ({
        ...prev,
        [docType]: null,
      }));
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
            <h2 className="documents-title">
              📄 Uploaded Documents
              {isEditing && <span className="edit-mode-badge">Edit Mode</span>}
            </h2>
            <div className="documents-grid">
              {renderDocumentItem(
                "resume",
                "📄",
                "Resume / CV",
                ".pdf,.doc,.docx,image/*"
              )}
              {renderDocumentItem(
                "application_form",
                "📋",
                "Application Form",
                ".pdf,.doc,.docx,image/*"
              )}
              {renderDocumentItem(
                "ids_passport",
                "🪪",
                "IDs and Passport",
                ".pdf,image/*"
              )}
              {renderDocumentItem(
                "medical_results",
                "🏥",
                "Medical Results",
                ".pdf,.doc,.docx,image/*"
              )}
              {renderDocumentItem(
                "signed_contracts",
                "📝",
                "Signed Contracts",
                ".pdf,.doc,.docx"
              )}
              {renderDocumentItem(
                "visa_copy",
                "✈️",
                "Visa Copy",
                ".pdf,image/*"
              )}
              {renderDocumentItem(
                "other_documents",
                "📦",
                "Other Documents",
                ".pdf,.doc,.docx,.xls,.xlsx,image/*,video/*"
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

      {/* Document Viewer Modal */}
      {viewingDocument && (
        <div className="viewer-overlay" onClick={handleCloseViewer}>
          <div className="viewer-modal" onClick={(e) => e.stopPropagation()}>
            <div className="viewer-header">
              <h3>{viewingDocument.type}</h3>
              <button onClick={handleCloseViewer} className="viewer-close">
                ×
              </button>
            </div>
            <div className="viewer-info">
              <span className="viewer-filename">📄 {viewingDocument.name}</span>
              <span className="viewer-size">{viewingDocument.size}</span>
            </div>
            <div className="viewer-content">
              {viewingDocument.type.includes("pdf") ||
              viewingDocument.name.toLowerCase().endsWith(".pdf") ? (
                <div className="pdf-viewer">
                  <div className="pdf-placeholder">
                    <div className="pdf-icon">📄</div>
                    <h3>PDF Document Preview</h3>
                    <p className="pdf-name">{viewingDocument.name}</p>
                    <p className="pdf-message">
                      In a production environment, this would display the PDF
                      using a viewer like PDF.js or an iframe.
                    </p>
                    <div className="pdf-sample">
                      <div className="pdf-page">
                        <div className="pdf-header">
                          <strong>{viewingDocument.type}</strong>
                        </div>
                        <div className="pdf-body">
                          <p>
                            <strong>Document Information</strong>
                          </p>
                          <p>Filename: {viewingDocument.name}</p>
                          <p>File size: {viewingDocument.size}</p>
                          <p>Upload date: {viewingDocument.uploadDate}</p>
                          <p>Document type: {viewingDocument.type}</p>
                          <br />
                          <p>
                            <strong>Applicant:</strong> {applicant.first_name}{" "}
                            {applicant.middle_name} {applicant.last_name}
                          </p>
                          <p>
                            <strong>Job Applied:</strong>{" "}
                            {applicant.job_applied_for}
                          </p>
                          <p>
                            <strong>Destination:</strong>{" "}
                            {applicant.country_of_destination}
                          </p>
                          <br />
                          <p className="print-note">
                            The actual document content would appear here when
                            connected to a real backend with file storage.
                          </p>
                          <br />
                          <p className="print-note">
                            <em>
                              This is a preview placeholder. Use the Print
                              button to print this information, or Download to
                              save the actual file.
                            </em>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : viewingDocument.name
                  .toLowerCase()
                  .match(/\.(jpg|jpeg|png|gif)$/i) ? (
                <div className="image-viewer">
                  <div className="image-placeholder">
                    <div className="image-icon">🖼️</div>
                    <h3>Image Preview</h3>
                    <p className="image-name">{viewingDocument.name}</p>
                    <p className="image-message">
                      The image would be displayed here in a production
                      environment.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="document-viewer">
                  <div className="document-placeholder">
                    <div className="doc-icon">📄</div>
                    <h3>Document Preview</h3>
                    <p className="doc-name">{viewingDocument.name}</p>
                    <p className="doc-message">
                      Document preview not available in mock mode. In
                      production, this would show the document content.
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="viewer-footer">
              <button onClick={handleCloseViewer} className="viewer-close-btn">
                Close
              </button>
              <div className="viewer-actions-group">
                <button
                  onClick={handlePrintDocument}
                  className="viewer-print-btn"
                  title="Print document"
                >
                  🖨️ Print
                </button>
                <button
                  className="viewer-download-btn"
                  title="Download document"
                >
                  ⬇️ Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
