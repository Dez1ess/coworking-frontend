function About_Values_Section() {
  return (
    <>
      <section className="about-values">
        <div className="about-values__title">
          <h2>Our Core Values</h2>
        </div>
        <div className="about-values__cards">
          <div className="about-values-card">
            <div className="about-values-card__title">🎯 Productivity</div>
            <div className="about-values-card__descr">
              <p>
                Spaces and tools designed to help you achieve your best work
                every day.
              </p>
            </div>
          </div>
          <div className="about-values-card">
            <div className="about-values-card__title">🤝 Community</div>
            <div className="about-values-card__descr">
              <p>
                Building meaningful connections between professionals from
                diverse backgrounds.
              </p>
            </div>
          </div>
          <div className="about-values-card">
            <div className="about-values-card__title">✨ Excellence</div>
            <div className="about-values-card__descr">
              <p>
                Maintaining high standards in every aspect of our service and
                facilities.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default About_Values_Section;
