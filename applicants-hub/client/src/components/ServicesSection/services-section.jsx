import "./services-section.css";

export default function ServicesReview() {
  const services = [
    { title: "Web Development", desc: "Modern, fast, and responsive websites." },
    { title: "UI/UX Design", desc: "User-centered interfaces that convert." },
    { title: "Branding", desc: "Create a strong identity for your business." },
    { title: "SEO Optimization", desc: "Increase your search visibility." },
    { title: "Social Media Management", desc: "Grow your audience strategically." }
  ];

  return (
    <section className="services-review-container">
      <h2 className="services-review-title">Our Services</h2>
      <div className="services-review-grid">
        {services.map((service, i) => (
          <div key={i} className="service-card">
            <h3>{service.title}</h3>
            <p>{service.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
