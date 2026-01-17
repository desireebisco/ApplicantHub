import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import ApplicantsForm from "./components/applicantForm/applicant-form";
import ApplicantListPage from "./components/applicantList/applicant-list-page";
import { ApplicantProvider } from "./state/ApplicantContext";
import ApplicantDetailPage from "./components/applicantDetail/applicant-detail-page";

function App() {
  return (
    <ApplicantProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<ApplicantsForm />} />
            <Route path="/applicants" element={<ApplicantListPage />} />
            <Route path="/applicants/:id" element={<ApplicantDetailPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ApplicantProvider>
  );
}

export default App;
