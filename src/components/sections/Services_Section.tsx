import { Link } from "react-router-dom";

function Services_Section() {
  return (
    <>
      <section className="services">
        <div className="services__title">
          <h1>Choose Your Plan</h1>
        </div>
        <div className="services__descr">
          <p>Find the perfect workspace solution for your needs</p>
        </div>

        <div className="services__cards">
          <div className="services-card">
            <div className="services-card__name">Daily Pass</div>
            <div className="services-card__descr">
              Perfect for single visits
            </div>
            <div className="services-card__price">
              <span>$15</span>/day
            </div>
            <ul className="services-card__list">
              <li>✅ 8 hours workspace access</li>
              <li>✅ High-speed WiFi</li>
              <li>✅ Free parking</li>
              <li>✅ Coffee & Tea</li>
            </ul>
            <Link to={"/login"} className="services-card__btn">
              Book a Space
            </Link>
          </div>
          <div className="services-card popular">
            <div className="services-card__banner">⭐ MOST POPULAR</div>
            <div className="services-card__name">Monthly Plan</div>
            <div className="services-card__descr">For permanent work</div>
            <div className="services-card__price">
              <span>$120</span>/month
            </div>
            <ul className="services-card__list">
              <li>✅ 24/7 workspace access</li>
              <li>✅ High-speed WiFi</li>
              <li>✅ Unlimited coffee & tea</li>
              <li>✅ Private parking</li>
              <li>✅ Meeting rooms access</li>
              <li>✅ Secure storage</li>
            </ul>
            <Link to={"/login"} className="services-card__btn">
              Join Now
            </Link>
          </div>
          <div className="services-card">
            <div className="services-card__name">Team Room</div>
            <div className="services-card__descr">For teams and projects</div>
            <div className="services-card__price">
              <span>$250</span>/month
            </div>
            <ul className="services-card__list">
              <li>✅ Private room for team</li>
              <li>✅ 24/7 access</li>
              <li>✅ Meeting room included</li>
              <li>✅ Dedicated WiFi line</li>
              <li>✅ Administrative support</li>
              <li>✅ Up to 10 people capacity</li>
            </ul>
            <Link to={"/login"} className="services-card__btn">
              Book a Space
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Services_Section;
