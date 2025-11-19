import { Link } from "react-router-dom";
import heroSectionImg from "../../assets/hero_section_image.jpg";

function Home_Hero_Section() {
  return (
    <>
      <section className="home-hero">
        <div className="home-hero__content">
          <h1>Work smarter in our coworking space</h1>
          <Link to={"/login"}>Book a workspace</Link>
        </div>
        <div className="home-hero__img">
          <img src={heroSectionImg} alt="" />
        </div>
      </section>
    </>
  );
}

export default Home_Hero_Section;
