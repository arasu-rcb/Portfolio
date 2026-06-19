import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer"
import Navbar from "./components/Navbar"
import About from './sections/About'
import Education from "./sections/Education"
import Experience from "./sections/Experience"
import Project from "./sections/Project"
import Skills from "./sections/Skills"
import Contact from "./sections/contact"

import AdminLogin from "./pages/AdminLogin";
import OtpVerification from "./pages/OtpVerification";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

// Main Portfolio Landing Page Component
const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <About />
      <Education />
      <Skills />
      <Experience />
      <Project />
      <Contact />
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Portfolio Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Admin Login */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* OTP Verification Page */}
        <Route path="/admin/otp-verification" element={<OtpVerification />} />

        {/* Protected Admin Dashboard */}
        <Route
          path="/admin/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;