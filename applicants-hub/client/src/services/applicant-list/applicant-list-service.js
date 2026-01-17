// Mock API Service for Applicants
// This simulates API calls with fake delays and will be easy to replace with real API later

// Mock data storage (simulates database)
let mockApplicants = [
  {
    id: 1,
    // Job Information
    job_applied_for: "Domestic Helper",
    country_of_destination: "Hong Kong",

    // Personal Information
    first_name: "Maria",
    middle_name: "Santos",
    last_name: "Cruz",
    gender: "Female",
    date_of_birth: "1990-05-15",
    age: "34",
    nationality: "Filipino",
    civil_status: "Single",

    // Contact Information
    contact_number_1: "+63 917 123 4567",
    contact_number_2: "+63 918 987 6543",
    email: "maria.cruz@email.com",
    social_media_fb: "mariacruz",
    social_media_tiktok: "@maria_c",
    social_media_ig: "maria_cruz",

    // Address
    street_address: "123 Main Street",
    barangay: "San Isidro",
    city: "Makati City",
    province: "Metro Manila",
    postal_code: "1200",

    // Emergency Contact
    emergency_contact_name: "Juan Cruz",
    emergency_contact_number: "+63 919 111 2222",
    emergency_contact_fb: "juancruz",
    emergency_contact_tiktok: "",
    emergency_contact_ig: "juan.cruz",
    emergency_contact_street: "123 Main Street",
    emergency_contact_barangay: "San Isidro",
    emergency_contact_city: "Makati City",
    emergency_contact_province: "Metro Manila",
    emergency_contact_postal: "1200",

    // Work Experience
    work_country: "Hong Kong",
    years_of_experience: "2.5",
    job_position: "Domestic Helper",

    // Remarks
    remarks:
      "Available for immediate deployment. Has experience with elderly care.",
  },
  {
    id: 2,
    // Job Information
    job_applied_for: "Construction Worker",
    country_of_destination: "Saudi Arabia",

    // Personal Information
    first_name: "Jose",
    middle_name: "Reyes",
    last_name: "Dela Cruz",
    gender: "Male",
    date_of_birth: "1985-08-22",
    age: "39",
    nationality: "Filipino",
    civil_status: "Married",

    // Contact Information
    contact_number_1: "+63 920 234 5678",
    contact_number_2: "+63 921 345 6789",
    email: "jose.delacruz@email.com",
    social_media_fb: "jose.delacruz",
    social_media_tiktok: "",
    social_media_ig: "jose_dc",

    // Address
    street_address: "456 Oak Avenue",
    barangay: "Poblacion",
    city: "Quezon City",
    province: "Metro Manila",
    postal_code: "1100",

    // Emergency Contact
    emergency_contact_name: "Rosa Dela Cruz",
    emergency_contact_number: "+63 922 333 4444",
    emergency_contact_fb: "rosa.delacruz",
    emergency_contact_tiktok: "@rosa_dc",
    emergency_contact_ig: "",
    emergency_contact_street: "456 Oak Avenue",
    emergency_contact_barangay: "Poblacion",
    emergency_contact_city: "Quezon City",
    emergency_contact_province: "Metro Manila",
    emergency_contact_postal: "1100",

    // Work Experience
    work_country: "Saudi Arabia",
    years_of_experience: "5",
    job_position: "Mason",

    // Remarks
    remarks:
      "Experienced mason with TESDA certification. Willing to work overtime.",
  },
  {
    id: 3,
    // Job Information
    job_applied_for: "Nurse",
    country_of_destination: "United Kingdom",

    // Personal Information
    first_name: "Anna",
    middle_name: "Marie",
    last_name: "Santos",
    gender: "Female",
    date_of_birth: "1992-12-10",
    age: "32",
    nationality: "Filipino",
    civil_status: "Single",

    // Contact Information
    contact_number_1: "+63 923 456 7890",
    contact_number_2: "",
    email: "anna.santos@email.com",
    social_media_fb: "anna.m.santos",
    social_media_tiktok: "@nurse_anna",
    social_media_ig: "anna_santos_rn",

    // Address
    street_address: "789 Pine Road",
    barangay: "Barangka",
    city: "Mandaluyong City",
    province: "Metro Manila",
    postal_code: "1550",

    // Emergency Contact
    emergency_contact_name: "Pedro Santos",
    emergency_contact_number: "+63 924 555 6666",
    emergency_contact_fb: "pedro.santos",
    emergency_contact_tiktok: "",
    emergency_contact_ig: "",
    emergency_contact_street: "789 Pine Road",
    emergency_contact_barangay: "Barangka",
    emergency_contact_city: "Mandaluyong City",
    emergency_contact_province: "Metro Manila",
    emergency_contact_postal: "1550",

    // Work Experience
    work_country: "Philippines",
    years_of_experience: "4",
    job_position: "Staff Nurse",

    // Remarks
    remarks:
      "Registered nurse with ICU experience. IELTS qualified (Band 7.0).",
  },
  {
    id: 4,
    // Job Information
    job_applied_for: "Factory Worker",
    country_of_destination: "Taiwan",

    // Personal Information
    first_name: "Michelle",
    middle_name: "Joy",
    last_name: "Garcia",
    gender: "Female",
    date_of_birth: "1988-03-18",
    age: "36",
    nationality: "Filipino",
    civil_status: "Married",

    // Contact Information
    contact_number_1: "+63 925 678 9012",
    contact_number_2: "+63 926 789 0123",
    email: "michelle.garcia@email.com",
    social_media_fb: "michelle.garcia88",
    social_media_tiktok: "@michelle_g",
    social_media_ig: "michelle.garcia",

    // Address
    street_address: "321 Elm Street",
    barangay: "Ugong",
    city: "Pasig City",
    province: "Metro Manila",
    postal_code: "1604",

    // Emergency Contact
    emergency_contact_name: "Roberto Garcia",
    emergency_contact_number: "+63 927 890 1234",
    emergency_contact_fb: "roberto.garcia",
    emergency_contact_tiktok: "",
    emergency_contact_ig: "rob_garcia",
    emergency_contact_street: "321 Elm Street",
    emergency_contact_barangay: "Ugong",
    emergency_contact_city: "Pasig City",
    emergency_contact_province: "Metro Manila",
    emergency_contact_postal: "1604",

    // Work Experience
    work_country: "Taiwan",
    years_of_experience: "3",
    job_position: "Production Operator",

    // Remarks
    remarks:
      "Experienced in electronics manufacturing. Contract completed, seeking new placement.",
  },
  {
    id: 5,
    // Job Information
    job_applied_for: "Caregiver",
    country_of_destination: "Canada",

    // Personal Information
    first_name: "Linda",
    middle_name: "Rose",
    last_name: "Ramos",
    gender: "Female",
    date_of_birth: "1995-07-25",
    age: "29",
    nationality: "Filipino",
    civil_status: "Single",

    // Contact Information
    contact_number_1: "+63 928 901 2345",
    contact_number_2: "",
    email: "linda.ramos@email.com",
    social_media_fb: "linda.rose.ramos",
    social_media_tiktok: "@linda_care",
    social_media_ig: "linda_ramos",

    // Address
    street_address: "654 Maple Drive",
    barangay: "Kapitolyo",
    city: "Pasig City",
    province: "Metro Manila",
    postal_code: "1603",

    // Emergency Contact
    emergency_contact_name: "Carmen Ramos",
    emergency_contact_number: "+63 929 012 3456",
    emergency_contact_fb: "carmen.ramos",
    emergency_contact_tiktok: "@carmen_r",
    emergency_contact_ig: "",
    emergency_contact_street: "654 Maple Drive",
    emergency_contact_barangay: "Kapitolyo",
    emergency_contact_city: "Pasig City",
    emergency_contact_province: "Metro Manila",
    emergency_contact_postal: "1603",

    // Work Experience
    work_country: "Philippines",
    years_of_experience: "1.5",
    job_position: "Caregiver",

    // Remarks
    remarks:
      "Certified caregiver (NC II). Experience with children and elderly. Available immediately.",
  },
];

let mockCustomFields = [];

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
