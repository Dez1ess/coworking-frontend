function Footer() {
  return (
    <>
      <footer className="footer-wr">
        <div className="container">
          <div className="footer">
            <div className="footer__columns">
              <div className="footer-column">
                <div className="footer-column__title">Contact</div>
                <ul className="footer-column__list">
                  <li>Address: 10 Central Street, Rivne, Ukraine</li>
                  <li>Phone: +380 50 123 45 67</li>
                  <li>Email: info@coworking.ua</li>
                </ul>
              </div>
              <div className="footer-column">
                <div className="footer-column__title">About</div>
                <ul className="footer-column__list">
                  <li>
                    Coworking Space is a modern environment for freelancers,
                    teams, and startups, helping you work efficiently and grow.
                  </li>
                </ul>
              </div>
            </div>
            <div className="footer__socials">
              <a href="#!" onClick={(e) => e.preventDefault()}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M14.2737 10.1635L23.2023 0H21.0872L13.3313 8.82305L7.14125 0H0L9.3626 13.3433L0 24H2.11504L10.3002 14.6806L16.8388 24H23.98M2.8784 1.5619H6.12769L21.0856 22.5148H17.8355"
                    fill="#1E1E1E"
                  />
                </svg>
              </a>
              <a href="#!" onClick={(e) => e.preventDefault()}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <g clip-path="url(#clip0_18_2141)">
                    <path
                      d="M12 2.163C15.204 2.163 15.584 2.175 16.85 2.233C20.102 2.381 21.621 3.924 21.769 7.152C21.827 8.417 21.838 8.797 21.838 12.001C21.838 15.206 21.826 15.585 21.769 16.85C21.62 20.075 20.105 21.621 16.85 21.769C15.584 21.827 15.206 21.839 12 21.839C8.796 21.839 8.416 21.827 7.151 21.769C3.891 21.62 2.38 20.07 2.232 16.849C2.174 15.584 2.162 15.205 2.162 12C2.162 8.796 2.175 8.417 2.232 7.151C2.381 3.924 3.896 2.38 7.151 2.232C8.417 2.175 8.796 2.163 12 2.163ZM12 0C8.741 0 8.333 0.014 7.053 0.072C2.695 0.272 0.273 2.69 0.073 7.052C0.014 8.333 0 8.741 0 12C0 15.259 0.014 15.668 0.072 16.948C0.272 21.306 2.69 23.728 7.052 23.928C8.333 23.986 8.741 24 12 24C15.259 24 15.668 23.986 16.948 23.928C21.302 23.728 23.73 21.31 23.927 16.948C23.986 15.668 24 15.259 24 12C24 8.741 23.986 8.333 23.928 7.053C23.732 2.699 21.311 0.273 16.949 0.073C15.668 0.014 15.259 0 12 0ZM12 5.838C8.597 5.838 5.838 8.597 5.838 12C5.838 15.403 8.597 18.163 12 18.163C15.403 18.163 18.162 15.404 18.162 12C18.162 8.597 15.403 5.838 12 5.838ZM12 16C9.791 16 8 14.21 8 12C8 9.791 9.791 8 12 8C14.209 8 16 9.791 16 12C16 14.21 14.209 16 12 16ZM18.406 4.155C17.61 4.155 16.965 4.8 16.965 5.595C16.965 6.39 17.61 7.035 18.406 7.035C19.201 7.035 19.845 6.39 19.845 5.595C19.845 4.8 19.201 4.155 18.406 4.155Z"
                      fill="#1E1E1E"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_18_2141">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </a>
              <a href="#!" onClick={(e) => e.preventDefault()}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <g clip-path="url(#clip0_18_2143)">
                    <path
                      d="M19.615 3.184C16.011 2.938 7.984 2.939 4.385 3.184C0.488 3.45 0.029 5.804 0 12C0.029 18.185 0.484 20.549 4.385 20.816C7.985 21.061 16.011 21.062 19.615 20.816C23.512 20.55 23.971 18.196 24 12C23.971 5.815 23.516 3.451 19.615 3.184ZM9 16V8L17 11.993L9 16Z"
                      fill="#1E1E1E"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_18_2143">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </a>
              <a href="#!" onClick={(e) => e.preventDefault()}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <g clip-path="url(#clip0_18_2145)">
                    <path
                      d="M19 0H5C2.239 0 0 2.239 0 5V19C0 21.761 2.239 24 5 24H19C21.762 24 24 21.761 24 19V5C24 2.239 21.762 0 19 0ZM8 19H5V8H8V19ZM6.5 6.732C5.534 6.732 4.75 5.942 4.75 4.968C4.75 3.994 5.534 3.204 6.5 3.204C7.466 3.204 8.25 3.994 8.25 4.968C8.25 5.942 7.467 6.732 6.5 6.732ZM20 19H17V13.396C17 10.028 13 10.283 13 13.396V19H10V8H13V9.765C14.396 7.179 20 6.988 20 12.241V19Z"
                      fill="#1E1E1E"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_18_2145">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
