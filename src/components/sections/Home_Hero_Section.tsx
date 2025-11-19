import { Link } from "react-router-dom";

function Home_Hero_Section() {
  return (
    <>
      <section className="home-hero">
        <div className="home-hero__content">
          <h1>Work smarter in our coworking space</h1>
          <Link to={"/login"}>Book a workspace</Link>
        </div>
        <div className="home-hero__img">
          <img src="./src/assets/hero_section_image.jpg" alt="" />
        </div>
      </section>
    </>
  );
}

export default Home_Hero_Section;
