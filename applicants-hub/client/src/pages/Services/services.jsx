import Navbar from "../../components/Navbar/navbar";
import "./Services.css";

export default function Services() {
  const services = [
    {
      title: "Web Development",
      desc: "We build fast, responsive, and modern websites using the latest technologies.",
    },
    {
      title: "UI/UX Design",
      desc: "We design clean and user-friendly interfaces that convert visitors into customers.",
    },
    {
      title: "Branding",
      desc: "Build your identity with professional logos, colors, typography, and more.",
    },
    {
      title: "SEO Optimization",
      desc: "Improve your search ranking and drive more organic traffic.",
    },
    {
      title: "Social Media Management",
      desc: "We grow your presence through strategic marketing.",
    }
  ];

  return (
    <>
      <Navbar />

      <div className="services-page">
        <h1 className="services-page-title">Our Services</h1>
        <div className="services-page-grid">
          {services.map((s, i) => (
            <div key={i} className="service-card">
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
