import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home/home";
import About from "./pages/About/about";
import Contact from "./pages/Contact/contact";
import Services from "./pages/Services/services";
import ApplicantsForm from "./components/applicantForm/applicant-form";
import ApplicantListPage from "./components/applicantList/applicant-list-page";
import { ApplicantProvider } from "./state/ApplicantContext";
import ApplicantDetailPage from "./components/applicantDetail/applicant-detail-page";
import ProtectedRoute from "./components/ProtectedRoute/protectedroute";

function App() {
  return (
    <ApplicantProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/add-applicant" element={<ApplicantsForm />} />
            <Route path="/applicants" element={<ApplicantListPage />} />
            <Route path="/applicants/:id" element={<ApplicantDetailPage />} />
            <Route
              path="/applicants"
              element={
                <ProtectedRoute>
                  <ApplicantListPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </ApplicantProvider>
  );
}

export default App;
