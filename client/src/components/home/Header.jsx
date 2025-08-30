import React from "react";
import "./header.css";

function Header() {
  return (
    <section id="home" className="header d-flex align-items-center justify-content-center text-center">
      <div>
        <h1 className="header-title">
          <img
            src="https://c8.alamy.com/comp/2MPTDEB/bangladesh-political-map-of-administrative-divisions-2MPTDEB.jpg"
            alt="Bangladesh Map"
            className="img-fluid me-2"
            style={{ width: "25px", height: "30px" }}
          />
          My Super App’s <span className="safe">Demo</span> Version LTS
        </h1>
      </div>
    </section>
  );
}

export default Header;
