import ourMissionImg from "../../assets/our-mission.jpg";

function About_Mission_Section() {
  return (
    <>
      <section className="about-mission">
        <div className="about-mission-content">
          <div className="about-mission-content__title">
            <h2>Our Mission</h2>
          </div>
          <div className="about-mission-content__description">
            <p>
              We believe that great work happens when people come together in
              the right environment. Our coworking space is designed to foster
              creativity, productivity, and meaningful professional
              relationships.
            </p>
            <p>
              Whether you're a freelancer, startup founder, or remote worker, we
              provide everything you need to succeed. From high-speed internet
              to comfortable workspaces, our infrastructure supports your goals.
            </p>
            <p>
              We're committed to building a vibrant community where innovation
              thrives and collaboration leads to success. Join us and be part of
              something bigger.
            </p>
          </div>
        </div>
        <div className="about-mission-img">
          <img src={ourMissionImg} alt="" />
        </div>
      </section>
    </>
  );
}

export default About_Mission_Section;
