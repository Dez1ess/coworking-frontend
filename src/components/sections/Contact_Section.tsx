import { useRef, FormEvent } from "react";
import emailjs from "@emailjs/browser";

function Contact_Section() {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!formRef.current) return;

    emailjs
      .sendForm(
        "service_ho8ra9u", // EmailJS Service ID
        "template_0l2gsas", // EmailJS Template ID
        formRef.current,
        "sD7paSo32BfoWa3wx" // EmailJS Public Key
      )
      .then(
        () => {
          alert("Message sent successfully!");
          formRef.current?.reset();
        },
        (error) => {
          alert("Failed to send message. Try again later.");
          console.error(error.text);
        }
      );
  };

  return (
    <>
      <section className="contact">
        <div className="contact__title">
          <h1>Contact Us</h1>
        </div>
        <div className="contact-form">
          <div className="contact-form-left">
            <div className="contact-form-left__title">Send us a Message</div>
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="contact-form"
            >
              <div className="contact-form__input">
                <label htmlFor="name">Name</label>
                <input type="text" name="name" id="name" required />
              </div>
              <div className="contact-form__input">
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" required />
              </div>
              <div className="contact-form__input">
                <label htmlFor="message">Message</label>
                <textarea
                  name="message"
                  id="message"
                  rows={5}
                  required
                ></textarea>
              </div>
              <button type="submit" className="contact-form__btn">
                Submit
              </button>
            </form>
          </div>
          <div className="contact-form-right">
            <div className="contact-form-right__map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2564.6837697929457!2d26.19!3d50.97!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4730a1ff3e3e3e3d%3A0x0!2sRivne%2C%20Ukraine!5e0!3m2!1sen!2sus!4v1234567890"
                loading="lazy"
              ></iframe>
            </div>
            <div className="contact-form-right-info">
              <div className="contact-form-right-info-item">
                <div className="contact-form-right-info-item__name">Phone</div>
                <div className="contact-form-right-info-item__value">
                  +380 (67) 123-4567
                </div>
              </div>
              <div className="contact-form-right-info-item">
                <div className="contact-form-right-info-item__name">Email</div>
                <div className="contact-form-right-info-item__value">
                  info@example.com
                </div>
              </div>
              <div className="contact-form-right-info-item">
                <div className="contact-form-right-info-item__name">
                  Working Hours
                </div>
                <div className="contact-form-right-info-item__value">
                  Mon - Fri: 9 AM - 6 PM
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Contact_Section;
