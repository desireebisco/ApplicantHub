import { createContext, useContext, useState, useEffect } from "react";
import applicantAPI from "../services/applicant-list/applicant-list-service";

const ApplicantContext = createContext();

export function ApplicantProvider({ children }) {
  const [applicants, setApplicants] = useState([]);
  const [customFields, setCustomFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch applicants and custom fields on mount
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch applicants and custom fields in parallel
      const [applicantsResponse, fieldsResponse] = await Promise.all([
        applicantAPI.getApplicants(),
        applicantAPI.getCustomFields(),
      ]);

      if (applicantsResponse.success) {
        setApplicants(applicantsResponse.data);
      }

      if (fieldsResponse.success) {
        setCustomFields(fieldsResponse.data);
      }
    } catch (err) {
      console.error("Error fetching initial data:", err);
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const addApplicant = async (applicant) => {
    try {
      const response = await applicantAPI.createApplicant(applicant);

      if (response.success) {
        setApplicants((prev) => [...prev, response.data]);
        return { success: true, data: response.data };
      }
    } catch (err) {
      console.error("Error adding applicant:", err);
      return { success: false, error: err.message };
    }
  };

  const deleteApplicant = async (id) => {
    try {
      const response = await applicantAPI.deleteApplicant(id);

      if (response.success) {
        setApplicants((prev) => prev.filter((app) => app.id !== id));
        return { success: true };
      }
    } catch (err) {
      console.error("Error deleting applicant:", err);
      return { success: false, error: err.message };
    }
  };

  const updateApplicant = async (id, updatedData) => {
    try {
      const response = await applicantAPI.updateApplicant(id, updatedData);

      if (response.success) {
        setApplicants((prev) =>
          prev.map((app) => (app.id === id ? response.data : app))
        );
        return { success: true, data: response.data };
      }
    } catch (err) {
      console.error("Error updating applicant:", err);
      return { success: false, error: err.message };
    }
  };

  const addCustomField = async (field) => {
    try {
      const response = await applicantAPI.createCustomField(field);

      if (response.success) {
        setCustomFields((prev) => [...prev, response.data]);
        return { success: true, data: response.data };
      }
    } catch (err) {
      console.error("Error adding custom field:", err);
      return { success: false, error: err.message };
    }
  };

  const removeCustomField = async (fieldId) => {
    try {
      const response = await applicantAPI.deleteCustomField(fieldId);

      if (response.success) {
        setCustomFields((prev) => prev.filter((field) => field.id !== fieldId));
        return { success: true };
      }
    } catch (err) {
      console.error("Error removing custom field:", err);
      return { success: false, error: err.message };
    }
  };

  const refreshApplicants = async () => {
    try {
      setLoading(true);
      const response = await applicantAPI.getApplicants();

      if (response.success) {
        setApplicants(response.data);
      }
    } catch (err) {
      console.error("Error refreshing applicants:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ApplicantContext.Provider
      value={{
        applicants,
        customFields,
        loading,
        error,
        addApplicant,
        updateApplicant,
        deleteApplicant,
        addCustomField,
        removeCustomField,
        refreshApplicants,
      }}
    >
      {children}
    </ApplicantContext.Provider>
  );
}

export function useApplicants() {
  const context = useContext(ApplicantContext);
  if (!context) {
    throw new Error("useApplicants must be used within ApplicantProvider");
  }
  return context;
}
