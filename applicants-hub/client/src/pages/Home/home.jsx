import Navbar from "../../components/Navbar/navbar";
import Hero from "../../components/Hero/hero";
import ServicesSection from "../../components/ServicesSection/services-section";
import "./home.css";

export default function Home() {
  return (
    <div className="homepage-container">
      <Navbar />
      <Hero />
      <ServicesSection />
    </div>
  );
}
