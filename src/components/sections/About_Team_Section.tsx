function About_Team_Section() {
  return (
    <>
      <section className="about-team">
        <div className="about-team__title">
          <h2>Meet Our Team</h2>
        </div>
        <div className="about-team__cards">
          <div className="about-team-card">
            <div className="about-team-card__img">
              <img src="./src/assets/team_1.png" alt="" />
            </div>
            <div className="about-team-card__name">John Smith</div>
            <div className="about-team-card__position">Founder & CEO</div>
            <div className="about-team-card__descr">
              Passionate about creating inspiring workspaces. 10+ years in real
              estate and community building.
            </div>
          </div>
          <div className="about-team-card">
            <div className="about-team-card__img">
              <img src="./src/assets/team_2.png" alt="" />
            </div>
            <div className="about-team-card__name">Sarah Johnson</div>
            <div className="about-team-card__position">Community Manager</div>
            <div className="about-team-card__descr">
              Dedicated to building strong connections and supporting our member
              community.
            </div>
          </div>
          <div className="about-team-card">
            <div className="about-team-card__img">
              <img src="./src/assets/team_3.png" alt="" />
            </div>
            <div className="about-team-card__name">Mike Chen</div>
            <div className="about-team-card__position">Operations Manager</div>
            <div className="about-team-card__descr">
              Ensures smooth operations and excellent experience for all
              members.
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default About_Team_Section;
