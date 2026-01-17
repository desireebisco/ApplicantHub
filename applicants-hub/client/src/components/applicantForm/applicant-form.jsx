import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useApplicants } from "./ApplicantContext";
import "./applicant-form.css";
import { useApplicants } from "../../state/ApplicantContext";

export default function ApplicantFormPage() {
  const { addApplicant, customFields, addCustomField, removeCustomField } =
    useApplicants();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    street_address: "",
    barangay: "",
    city: "",
    province: "",
    postal_code: "",
    birthday: "",
  });

  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldType, setNewFieldType] = useState("text");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Handle standard field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle custom field changes
  const handleCustomFieldChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  // Add new custom field
  const handleAddCustomField = async () => {
    if (newFieldName.trim()) {
      const fieldId = newFieldName.toLowerCase().replace(/\s+/g, "_");
      const result = await addCustomField({
        id: fieldId,
        label: newFieldName,
        type: newFieldType,
      });

      if (result.success) {
        setFormData((prev) => ({
          ...prev,
          [fieldId]: "",
        }));
        setNewFieldName("");
        setNewFieldType("text");
      }
    }
  };

  // Remove custom field
  const handleRemoveCustomField = async (fieldId) => {
    await removeCustomField(fieldId);
    setFormData((prev) => {
      const newData = { ...prev };
      delete newData[fieldId];
      return newData;
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await addApplicant(formData);

      if (result.success) {
        // Reset form
        const resetData = {
          name: "",
          street_address: "",
          barangay: "",
          city: "",
          province: "",
          postal_code: "",
          birthday: "",
        };
        customFields.forEach((field) => {
          resetData[field.id] = "";
        });
        setFormData(resetData);

        // Show success message
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        setSubmitError(result.error || "Failed to save applicant");
      }
    } catch (error) {
      setSubmitError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-page-container">
      <div className="form-section">
        <div className="form-header">
          <h1>Applicant Registration</h1>
          <p className="subtitle">
            Add applicant information with custom fields
          </p>
        </div>

        <form onSubmit={handleSubmit} className="applicant-form">
          {/* Standard Fields */}
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter full name"
            />
          </div>

          {/* Address Section */}
          <div className="address-section">
            <h3 className="section-title">Address Information</h3>

            <div className="form-group">
              <label htmlFor="street_address">Street Address *</label>
              <input
                type="text"
                id="street_address"
                name="street_address"
                value={formData.street_address}
                onChange={handleChange}
                required
                placeholder="House/Building No., Street Name"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="barangay">Barangay *</label>
                <input
                  type="text"
                  id="barangay"
                  name="barangay"
                  value={formData.barangay}
                  onChange={handleChange}
                  required
                  placeholder="Enter barangay"
                />
              </div>

              <div className="form-group">
                <label htmlFor="city">City/Municipality *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="Enter city/municipality"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="province">Province *</label>
                <input
                  type="text"
                  id="province"
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  required
                  placeholder="Enter province"
                />
              </div>

              <div className="form-group">
                <label htmlFor="postal_code">Postal Code</label>
                <input
                  type="text"
                  id="postal_code"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleChange}
                  placeholder="Enter postal code"
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="birthday">Birthday *</label>
            <input
              type="date"
              id="birthday"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              required
            />
          </div>

          {/* Custom Fields */}
          {customFields.map((field) => (
            <div key={field.id} className="form-group custom-field">
              <label htmlFor={field.id}>
                {field.label}
                <button
                  type="button"
                  onClick={() => handleRemoveCustomField(field.id)}
                  className="remove-field-btn"
                  title="Remove field"
                >
                  ×
                </button>
              </label>
              {field.type === "textarea" ? (
                <textarea
                  id={field.id}
                  value={formData[field.id] || ""}
                  onChange={(e) =>
                    handleCustomFieldChange(field.id, e.target.value)
                  }
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  rows="3"
                />
              ) : (
                <input
                  type={field.type}
                  id={field.id}
                  value={formData[field.id] || ""}
                  onChange={(e) =>
                    handleCustomFieldChange(field.id, e.target.value)
                  }
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              )}
            </div>
          ))}

          {/* Add Custom Field Section */}
          <div className="add-field-section">
            <h3>Add Custom Field</h3>
            <div className="add-field-controls">
              <input
                type="text"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                placeholder="Field name (e.g., Phone Number)"
                className="field-name-input"
              />
              <select
                value={newFieldType}
                onChange={(e) => setNewFieldType(e.target.value)}
                className="field-type-select"
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="tel">Phone</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
                <option value="textarea">Text Area</option>
              </select>
              <button
                type="button"
                onClick={handleAddCustomField}
                className="add-field-btn"
                disabled={!newFieldName.trim()}
              >
                + Add Field
              </button>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Applicant"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/applicants")}
            className="view-list-btn"
          >
            View All Applicants
          </button>
        </form>

        {showSuccess && (
          <div className="success-message">✓ Applicant added successfully!</div>
        )}

        {submitError && <div className="error-message">✗ {submitError}</div>}
      </div>
    </div>
  );
}
