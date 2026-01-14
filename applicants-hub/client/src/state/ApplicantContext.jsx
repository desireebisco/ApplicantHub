import { createContext, useContext, useState } from "react";

const ApplicantContext = createContext();

export function ApplicantProvider({ children }) {
  const [applicants, setApplicants] = useState([]);
  const [customFields, setCustomFields] = useState([]);

  const addApplicant = (applicant) => {
    setApplicants((prev) => [...prev, { ...applicant, id: Date.now() }]);
  };

  const deleteApplicant = (id) => {
    setApplicants((prev) => prev.filter((app) => app.id !== id));
  };

  const addCustomField = (field) => {
    setCustomFields((prev) => [...prev, field]);
  };

  const removeCustomField = (fieldId) => {
    setCustomFields((prev) => prev.filter((field) => field.id !== fieldId));
  };

  return (
    <ApplicantContext.Provider
      value={{
        applicants,
        customFields,
        addApplicant,
        deleteApplicant,
        addCustomField,
        removeCustomField,
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
