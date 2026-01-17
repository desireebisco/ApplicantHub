import Navbar from "../../components/Navbar/navbar";
import "./about.css";

export default function About() {
  return (
    <>
      <Navbar />
      <div className="about-container">
        <div className="about">
          <h1>About Us</h1>
          <p>
            We are a professional digital agency delivering modern websites, branding, 
            and UX design. Our mission is to help businesses grow with clean and 
            effective digital products.
          </p>
        </div>
      </div>
    </>
  );
}
