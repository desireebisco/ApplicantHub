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
    address: "",
    birthday: "",
  });

  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldType, setNewFieldType] = useState("text");
  const [showSuccess, setShowSuccess] = useState(false);

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
  const handleAddCustomField = () => {
    if (newFieldName.trim()) {
      const fieldId = newFieldName.toLowerCase().replace(/\s+/g, "_");
      addCustomField({
        id: fieldId,
        label: newFieldName,
        type: newFieldType,
      });
      setFormData((prev) => ({
        ...prev,
        [fieldId]: "",
      }));
      setNewFieldName("");
      setNewFieldType("text");
    }
  };

  // Remove custom field
  const handleRemoveCustomField = (fieldId) => {
    removeCustomField(fieldId);
    setFormData((prev) => {
      const newData = { ...prev };
      delete newData[fieldId];
      return newData;
    });
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    addApplicant(formData);

    // Reset form
    const resetData = {
      name: "",
      address: "",
      birthday: "",
    };
    customFields.forEach((field) => {
      resetData[field.id] = "";
    });
    setFormData(resetData);

    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
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

          <div className="form-group">
            <label htmlFor="address">Address *</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Enter complete address"
              rows="3"
            />
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

          <button type="submit" className="submit-btn">
            Save Applicant
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
      </div>
    </div>
  );
}
