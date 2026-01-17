// Mock API Service for Applicants
// This simulates API calls with fake delays and will be easy to replace with real API later

// Mock data storage (simulates database)
let mockApplicants = [
  {
    id: 1,
    name: "John Doe",
    street_address: "123 Main Street",
    barangay: "San Isidro",
    city: "Makati City",
    province: "Metro Manila",
    postal_code: "1200",
    birthday: "1990-05-15",
    phone_number: "+63 917 123 4567",
    email: "john.doe@example.com",
  },
  {
    id: 2,
    name: "Jane Smith",
    street_address: "456 Oak Avenue",
    barangay: "Poblacion",
    city: "Quezon City",
    province: "Metro Manila",
    postal_code: "1100",
    birthday: "1985-08-22",
    phone_number: "+63 918 987 6543",
    email: "jane.smith@example.com",
  },
  {
    id: 3,
    name: "Michael Johnson",
    street_address: "789 Pine Road",
    barangay: "Barangka",
    city: "Mandaluyong City",
    province: "Metro Manila",
    postal_code: "1550",
    birthday: "1992-12-10",
    phone_number: "+63 919 456 7890",
    email: "michael.j@example.com",
  },
  {
    id: 4,
    name: "Emily Davis",
    street_address: "321 Elm Street",
    barangay: "Ugong",
    city: "Pasig City",
    province: "Metro Manila",
    postal_code: "1604",
    birthday: "1988-03-18",
    phone_number: "+63 920 234 5678",
    email: "emily.davis@example.com",
  },
  {
    id: 5,
    name: "David Wilson",
    street_address: "654 Maple Drive",
    barangay: "Kapitolyo",
    city: "Pasig City",
    province: "Metro Manila",
    postal_code: "1603",
    birthday: "1995-07-25",
    phone_number: "+63 921 345 6789",
    email: "david.wilson@example.com",
  },
];

let mockCustomFields = [
  { id: "phone_number", label: "Phone Number", type: "tel" },
  { id: "email", label: "Email", type: "email" },
];

// Simulate network delay
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API functions
const applicantAPI = {
  // GET /api/applicants - Fetch all applicants
  async getApplicants() {
    await delay(800); // Simulate network delay

    // Simulate potential API error (uncomment to test error handling)
    // if (Math.random() > 0.8) {
    //   throw new Error('Failed to fetch applicants');
    // }

    return {
      success: true,
      data: [...mockApplicants],
      message: "Applicants fetched successfully",
    };
  },

  // POST /api/applicants - Create new applicant
  async createApplicant(applicantData) {
    await delay(600);

    const newApplicant = {
      ...applicantData,
      id: Date.now(), // Generate unique ID
    };

    mockApplicants.push(newApplicant);

    return {
      success: true,
      data: newApplicant,
      message: "Applicant created successfully",
    };
  },

  // PUT /api/applicants/:id - Update applicant
  async updateApplicant(id, applicantData) {
    await delay(600);

    const index = mockApplicants.findIndex((app) => app.id === id);

    if (index === -1) {
      throw new Error("Applicant not found");
    }

    mockApplicants[index] = {
      ...mockApplicants[index],
      ...applicantData,
    };

    return {
      success: true,
      data: mockApplicants[index],
      message: "Applicant updated successfully",
    };
  },

  // DELETE /api/applicants/:id - Delete applicant
  async deleteApplicant(id) {
    await delay(400);

    const index = mockApplicants.findIndex((app) => app.id === id);

    if (index === -1) {
      throw new Error("Applicant not found");
    }

    const deleted = mockApplicants.splice(index, 1)[0];

    return {
      success: true,
      data: deleted,
      message: "Applicant deleted successfully",
    };
  },

  // GET /api/custom-fields - Fetch custom fields
  async getCustomFields() {
    await delay(500);

    return {
      success: true,
      data: [...mockCustomFields],
      message: "Custom fields fetched successfully",
    };
  },

  // POST /api/custom-fields - Create custom field
  async createCustomField(fieldData) {
    await delay(400);

    const newField = {
      ...fieldData,
      id: fieldData.id || fieldData.label.toLowerCase().replace(/\s+/g, "_"),
    };

    mockCustomFields.push(newField);

    return {
      success: true,
      data: newField,
      message: "Custom field created successfully",
    };
  },

  // DELETE /api/custom-fields/:id - Delete custom field
  async deleteCustomField(fieldId) {
    await delay(400);

    const index = mockCustomFields.findIndex((f) => f.id === fieldId);

    if (index === -1) {
      throw new Error("Custom field not found");
    }

    const deleted = mockCustomFields.splice(index, 1)[0];

    return {
      success: true,
      data: deleted,
      message: "Custom field deleted successfully",
    };
  },
};

export default applicantAPI;

// Example usage:
/*
import applicantAPI from './services/applicantAPI';

// Fetch all applicants
const response = await applicantAPI.getApplicants();
console.log(response.data); // Array of applicants

// Create new applicant
const newApplicant = await applicantAPI.createApplicant({
  name: "New Person",
  address: "123 Street",
  birthday: "2000-01-01"
});

// Delete applicant
await applicantAPI.deleteApplicant(1);
*/
