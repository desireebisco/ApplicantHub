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
    // Job Information
    job_applied_for: "",
    country_of_destination: "",

    // Personal Information
    first_name: "",
    middle_name: "",
    last_name: "",
    gender: "",
    date_of_birth: "",
    age: "",
    nationality: "",
    civil_status: "",

    // Contact Information
    contact_number_1: "",
    contact_number_2: "",
    social_media_fb: "",
    social_media_tiktok: "",
    social_media_ig: "",
    email: "",

    // Address
    street_address: "",
    barangay: "",
    city: "",
    province: "",
    postal_code: "",

    // Emergency Contact
    emergency_contact_name: "",
    emergency_contact_number: "",
    emergency_contact_fb: "",
    emergency_contact_tiktok: "",
    emergency_contact_ig: "",
    emergency_contact_street: "",
    emergency_contact_barangay: "",
    emergency_contact_city: "",
    emergency_contact_province: "",
    emergency_contact_postal: "",

    // Work Experience
    work_country: "",
    years_of_experience: "",
    job_position: "",

    // Remarks
    remarks: "",
  });

  const [documents, setDocuments] = useState({
    resume: null,
    application_form: null,
    ids_passport: null,
    medical_results: null,
    signed_contracts: null,
    visa_copy: null,
    other_documents: null,
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

  // Calculate age from date of birth
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

  // Handle date of birth change and auto-calculate age
  const handleDateOfBirthChange = (e) => {
    const dateOfBirth = e.target.value;
    setFormData((prev) => ({
      ...prev,
      date_of_birth: dateOfBirth,
      age: calculateAge(dateOfBirth),
    }));
  };

  // Handle file upload
  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setDocuments((prev) => ({
        ...prev,
        [fieldName]: file,
      }));
    }
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
          job_applied_for: "",
          country_of_destination: "",
          first_name: "",
          middle_name: "",
          last_name: "",
          gender: "",
          date_of_birth: "",
          age: "",
          nationality: "",
          civil_status: "",
          contact_number_1: "",
          contact_number_2: "",
          social_media_fb: "",
          social_media_tiktok: "",
          social_media_ig: "",
          email: "",
          street_address: "",
          barangay: "",
          city: "",
          province: "",
          postal_code: "",
          emergency_contact_name: "",
          emergency_contact_number: "",
          emergency_contact_fb: "",
          emergency_contact_tiktok: "",
          emergency_contact_ig: "",
          emergency_contact_street: "",
          emergency_contact_barangay: "",
          emergency_contact_city: "",
          emergency_contact_province: "",
          emergency_contact_postal: "",
          work_country: "",
          years_of_experience: "",
          job_position: "",
          remarks: "",
        };
        customFields.forEach((field) => {
          resetData[field.id] = "";
        });
        setFormData(resetData);
        setDocuments({
          resume: null,
          application_form: null,
          ids_passport: null,
          medical_results: null,
          signed_contracts: null,
          visa_copy: null,
          other_documents: null,
        });

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
          {/* Job Information Section */}
          <div className="form-section">
            <h2 className="section-title-main">Job Information</h2>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="job_applied_for">Job Applied For *</label>
                <input
                  type="text"
                  id="job_applied_for"
                  name="job_applied_for"
                  value={formData.job_applied_for}
                  onChange={handleChange}
                  required
                  placeholder="Enter job position"
                />
              </div>

              <div className="form-group">
                <label htmlFor="country_of_destination">
                  Country of Destination *
                </label>
                <input
                  type="text"
                  id="country_of_destination"
                  name="country_of_destination"
                  value={formData.country_of_destination}
                  onChange={handleChange}
                  required
                  placeholder="Enter country"
                />
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="form-section">
            <h2 className="section-title-main">Personal Information</h2>

            <div className="form-row form-row-three">
              <div className="form-group">
                <label htmlFor="first_name">First Name *</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  placeholder="First name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="middle_name">Middle Name</label>
                <input
                  type="text"
                  id="middle_name"
                  name="middle_name"
                  value={formData.middle_name}
                  onChange={handleChange}
                  placeholder="Middle name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="last_name">Last Name *</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  placeholder="Last name"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="gender">Gender *</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="date_of_birth">Date of Birth *</label>
                <input
                  type="date"
                  id="date_of_birth"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleDateOfBirthChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="age">Age</label>
                <input
                  type="text"
                  id="age"
                  name="age"
                  value={formData.age}
                  readOnly
                  placeholder="Auto-calculated"
                  className="readonly-field"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nationality">Nationality *</label>
                <input
                  type="text"
                  id="nationality"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  required
                  placeholder="Enter nationality"
                />
              </div>

              <div className="form-group">
                <label htmlFor="civil_status">Civil Status *</label>
                <select
                  id="civil_status"
                  name="civil_status"
                  value={formData.civil_status}
                  onChange={handleChange}
                  required
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

          {/* Contact Information Section */}
          <div className="form-section">
            <h2 className="section-title-main">Contact Information</h2>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contact_number_1">Contact Number 1 *</label>
                <input
                  type="tel"
                  id="contact_number_1"
                  name="contact_number_1"
                  value={formData.contact_number_1}
                  onChange={handleChange}
                  required
                  placeholder="+63 XXX XXX XXXX"
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact_number_2">Contact Number 2</label>
                <input
                  type="tel"
                  id="contact_number_2"
                  name="contact_number_2"
                  value={formData.contact_number_2}
                  onChange={handleChange}
                  placeholder="+63 XXX XXX XXXX"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your.email@example.com"
              />
            </div>

            <div className="form-row form-row-three">
              <div className="form-group">
                <label htmlFor="social_media_fb">Facebook Account</label>
                <input
                  type="text"
                  id="social_media_fb"
                  name="social_media_fb"
                  value={formData.social_media_fb}
                  onChange={handleChange}
                  placeholder="Facebook username/URL"
                />
              </div>

              <div className="form-group">
                <label htmlFor="social_media_tiktok">TikTok Account</label>
                <input
                  type="text"
                  id="social_media_tiktok"
                  name="social_media_tiktok"
                  value={formData.social_media_tiktok}
                  onChange={handleChange}
                  placeholder="TikTok username"
                />
              </div>

              <div className="form-group">
                <label htmlFor="social_media_ig">Instagram Account</label>
                <input
                  type="text"
                  id="social_media_ig"
                  name="social_media_ig"
                  value={formData.social_media_ig}
                  onChange={handleChange}
                  placeholder="Instagram username"
                />
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="form-section">
            <h2 className="section-title-main">Full Address</h2>

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

          {/* Emergency Contact Section */}
          <div className="form-section emergency-section">
            <h2 className="section-title-main">Emergency Contact Details</h2>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="emergency_contact_name">
                  Contact Person Name *
                </label>
                <input
                  type="text"
                  id="emergency_contact_name"
                  name="emergency_contact_name"
                  value={formData.emergency_contact_name}
                  onChange={handleChange}
                  required
                  placeholder="Full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="emergency_contact_number">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  id="emergency_contact_number"
                  name="emergency_contact_number"
                  value={formData.emergency_contact_number}
                  onChange={handleChange}
                  required
                  placeholder="+63 XXX XXX XXXX"
                />
              </div>
            </div>

            <div className="form-row form-row-three">
              <div className="form-group">
                <label htmlFor="emergency_contact_fb">Facebook</label>
                <input
                  type="text"
                  id="emergency_contact_fb"
                  name="emergency_contact_fb"
                  value={formData.emergency_contact_fb}
                  onChange={handleChange}
                  placeholder="Facebook username/URL"
                />
              </div>

              <div className="form-group">
                <label htmlFor="emergency_contact_tiktok">TikTok</label>
                <input
                  type="text"
                  id="emergency_contact_tiktok"
                  name="emergency_contact_tiktok"
                  value={formData.emergency_contact_tiktok}
                  onChange={handleChange}
                  placeholder="TikTok username"
                />
              </div>

              <div className="form-group">
                <label htmlFor="emergency_contact_ig">Instagram</label>
                <input
                  type="text"
                  id="emergency_contact_ig"
                  name="emergency_contact_ig"
                  value={formData.emergency_contact_ig}
                  onChange={handleChange}
                  placeholder="Instagram username"
                />
              </div>
            </div>

            <h3 className="subsection-title">Emergency Contact Address</h3>

            <div className="form-group">
              <label htmlFor="emergency_contact_street">Street Address</label>
              <input
                type="text"
                id="emergency_contact_street"
                name="emergency_contact_street"
                value={formData.emergency_contact_street}
                onChange={handleChange}
                placeholder="House/Building No., Street Name"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="emergency_contact_barangay">Barangay</label>
                <input
                  type="text"
                  id="emergency_contact_barangay"
                  name="emergency_contact_barangay"
                  value={formData.emergency_contact_barangay}
                  onChange={handleChange}
                  placeholder="Enter barangay"
                />
              </div>

              <div className="form-group">
                <label htmlFor="emergency_contact_city">
                  City/Municipality
                </label>
                <input
                  type="text"
                  id="emergency_contact_city"
                  name="emergency_contact_city"
                  value={formData.emergency_contact_city}
                  onChange={handleChange}
                  placeholder="Enter city/municipality"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="emergency_contact_province">Province</label>
                <input
                  type="text"
                  id="emergency_contact_province"
                  name="emergency_contact_province"
                  value={formData.emergency_contact_province}
                  onChange={handleChange}
                  placeholder="Enter province"
                />
              </div>

              <div className="form-group">
                <label htmlFor="emergency_contact_postal">Postal Code</label>
                <input
                  type="text"
                  id="emergency_contact_postal"
                  name="emergency_contact_postal"
                  value={formData.emergency_contact_postal}
                  onChange={handleChange}
                  placeholder="Enter postal code"
                />
              </div>
            </div>
          </div>

          {/* Work Experience Section */}
          <div className="form-section">
            <h2 className="section-title-main">Work Experience</h2>

            <div className="form-row form-row-three">
              <div className="form-group">
                <label htmlFor="work_country">Country *</label>
                <input
                  type="text"
                  id="work_country"
                  name="work_country"
                  value={formData.work_country}
                  onChange={handleChange}
                  required
                  placeholder="Country of work"
                />
              </div>

              <div className="form-group">
                <label htmlFor="years_of_experience">
                  Years of Experience *
                </label>
                <input
                  type="number"
                  id="years_of_experience"
                  name="years_of_experience"
                  value={formData.years_of_experience}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.5"
                  placeholder="Years"
                />
              </div>

              <div className="form-group">
                <label htmlFor="job_position">Job Position *</label>
                <input
                  type="text"
                  id="job_position"
                  name="job_position"
                  value={formData.job_position}
                  onChange={handleChange}
                  required
                  placeholder="Position held"
                />
              </div>
            </div>
          </div>

          {/* Document Upload Section */}
          <div className="form-section document-section">
            <h2 className="section-title-main">Document Uploads</h2>
            <p className="section-description">
              Accepted formats: PDF, Word, Excel, Images (JPG, PNG), Videos
              (MP4, MOV)
            </p>

            <div className="document-grid">
              <div className="form-group">
                <label htmlFor="resume">Resume / CV *</label>
                <input
                  type="file"
                  id="resume"
                  name="resume"
                  onChange={(e) => handleFileChange(e, "resume")}
                  accept=".pdf,.doc,.docx,image/*"
                  required
                  className="file-input"
                />
                {documents.resume && (
                  <span className="file-name">📄 {documents.resume.name}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="application_form">Application Form</label>
                <input
                  type="file"
                  id="application_form"
                  name="application_form"
                  onChange={(e) => handleFileChange(e, "application_form")}
                  accept=".pdf,.doc,.docx,image/*"
                  className="file-input"
                />
                {documents.application_form && (
                  <span className="file-name">
                    📄 {documents.application_form.name}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="ids_passport">IDs and Passport Copies *</label>
                <input
                  type="file"
                  id="ids_passport"
                  name="ids_passport"
                  onChange={(e) => handleFileChange(e, "ids_passport")}
                  accept=".pdf,image/*"
                  required
                  className="file-input"
                />
                {documents.ids_passport && (
                  <span className="file-name">
                    📄 {documents.ids_passport.name}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="medical_results">Medical Results</label>
                <input
                  type="file"
                  id="medical_results"
                  name="medical_results"
                  onChange={(e) => handleFileChange(e, "medical_results")}
                  accept=".pdf,.doc,.docx,image/*"
                  className="file-input"
                />
                {documents.medical_results && (
                  <span className="file-name">
                    📄 {documents.medical_results.name}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="signed_contracts">Signed Contracts</label>
                <input
                  type="file"
                  id="signed_contracts"
                  name="signed_contracts"
                  onChange={(e) => handleFileChange(e, "signed_contracts")}
                  accept=".pdf,.doc,.docx"
                  className="file-input"
                />
                {documents.signed_contracts && (
                  <span className="file-name">
                    📄 {documents.signed_contracts.name}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="visa_copy">Visa Copy</label>
                <input
                  type="file"
                  id="visa_copy"
                  name="visa_copy"
                  onChange={(e) => handleFileChange(e, "visa_copy")}
                  accept=".pdf,image/*"
                  className="file-input"
                />
                {documents.visa_copy && (
                  <span className="file-name">
                    📄 {documents.visa_copy.name}
                  </span>
                )}
              </div>

              <div className="form-group full-width">
                <label htmlFor="other_documents">
                  Other Required Documents
                </label>
                <p className="field-hint">
                  Insurance, OWWA Cert, PDOS Cert, EREG PEOS, etc.
                </p>
                <input
                  type="file"
                  id="other_documents"
                  name="other_documents"
                  onChange={(e) => handleFileChange(e, "other_documents")}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,image/*,video/*"
                  className="file-input"
                />
                {documents.other_documents && (
                  <span className="file-name">
                    📄 {documents.other_documents.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Remarks Section */}
          <div className="form-section">
            <h2 className="section-title-main">Remarks</h2>

            <div className="form-group">
              <label htmlFor="remarks">Additional Notes</label>
              <textarea
                id="remarks"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Enter any additional remarks or notes..."
                rows="5"
                className="remarks-textarea"
              />
            </div>
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
