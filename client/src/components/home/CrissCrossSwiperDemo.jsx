import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "./CrissCrossSwiperDemo.css";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

const slides = [
  {
    id: 1,
    title: "Sunrise Beach",
    image: "https://cdn.wallpapersafari.com/47/81/GvPV8B.jpg",
  },
  {
    id: 2,
    title: "Forest Trail",
    image: "https://images.hdqwalls.com/download/canyonlands-sunrise-4k-dn-1360x768.jpg",
  },
  {
    id: 3,
    title: "Snowy Mountains",
    image: "https://thumbs.dreamstime.com/b/nature-thailand-rice-farm-44919269.jpg",
  },
  {
    id: 4,
    title: "Desert Dunes",
    image: "https://thumbs.dreamstime.com/b/rice-field-11331615.jpg",
  },
  {
    id: 5,
    title: "City Nights",
    image: "https://as1.ftcdn.net/v2/jpg/05/13/62/20/1000_F_513622056_aQR7ZWBkJ4NyzCByAgswMpNF3B6e9UIJ.jpg",
  },
];

const CrissCrossSwiperDemo = () => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="d-flex hero-section">
      {/* Hero Area with Horizontal Swiper */}
      <div className="hero-area position-relative flex-grow-1">
        {/* Background Horizontal Swiper */}
        <Swiper
          modules={[Autoplay, Pagination]}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          spaceBetween={0}
          slidesPerView={1}
          className="hero-bg-swiper"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div
                className="hero-slide"
                style={{
                  backgroundImage: `url(${slide.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: "100vh",
                  width: "100%",
                }}
              ></div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Overlay Text + Buttons */}
        <div className="hero-overlay text-white d-flex flex-column justify-content-center align-items-start p-5">
          <h1 className="display-3 fw-bold">Explore Nature</h1>
          <p className="lead mb-4">
            Discover the world’s most stunning landscapes. Scroll through the beauty.
          </p>
          <div className="mb-3">
            <a href="#explore" className="btn btn-light btn-lg">
              Get Started
            </a>
          </div>
          <div className="social-icons d-flex gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="text-white fs-4"
            >
              <FaFacebook />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="text-white fs-4"
            >
              <FaTwitter />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="text-white fs-4"
            >
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      {/* Vertical Slider Panel */}
      <div className="slider-panel position-relative">
        <Swiper
          direction="vertical"
          modules={[Mousewheel, Autoplay, Pagination]}
          mousewheel
          loop={true}
          autoplay={{ delay: 1500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          spaceBetween={10}
          slidesPerView={3}
          style={{ height: "100vh", width: "300px" }}
          centeredSlides={true}
          onClick={(swiper) => swiper.slideNext()}
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="slider-content">
                <img src={slide.image} alt={slide.title} />
                <h6 className="text-center mt-2 text-white bg-dark p-1">
                  {slide.title}
                </h6>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Floating Action Button */}
        <button
          className="btn btn-primary fab"
          onClick={() => setExpanded(!expanded)}
          title={expanded ? "Collapse" : "Expand"}
        >
          {expanded ? <FaChevronDown /> : <FaChevronUp />}
        </button>
      </div>
    </div>
  );
};

export default CrissCrossSwiperDemo;
