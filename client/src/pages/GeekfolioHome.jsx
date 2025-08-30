import React, { useEffect, useRef, useState } from "react";
import './GeekfolioHome.css';
/**
 * GeekfolioHome.jsx
 * A React conversion of the provided HTML/CSS/JS using Bootstrap v5.1.1 and animate.css 3.5.2.
 *
 * Setup notes:
 * 1) Ensure Bootstrap CSS is loaded (e.g., in src/main.jsx or index.js):
 *    import 'bootstrap/dist/css/bootstrap.min.css';
 *
 * 2) Optionally include animate.css (v3.5.2 CDN) in public/index.html or import it if you have it locally.
 *    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css" />
 *
 * 3) Put your images/fonts under /public/assets to match the src paths below (e.g., public/assets/imgs/background/14.jpg).
 */
import bgImage from "../assets/imgs/background/14.jpg";
import pattern from "../assets/imgs/patterns/graph.png";
import AppCircle from "./AppCircle";
import AppCirclePath from "./AppCirclePath";
import AppCircleLogo from "./AppCircleLogo";


export default function GeekfolioHome() {
  const progressPathRef = useRef(null);
  const progressWrapRef = useRef(null);
  const cursorRef = useRef(null);
  const [showVideo, setShowVideo] = useState(false);

  // Simple custom cursor + hover grow
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const move = (e) => {
      cursor.style.top = `${e.clientY}px`;
      cursor.style.left = `${e.clientX}px`;
    };
    const add = () => cursor.classList.add("cursor-active");
    const rm = () => cursor.classList.remove("cursor-active");

    window.addEventListener("mousemove", move);
    // Grow cursor over clickable elements
    const hovers = document.querySelectorAll("a, button, .hover-this");
    hovers.forEach((el) => {
      el.addEventListener("mouseenter", add);
      el.addEventListener("mouseleave", rm);
    });

    return () => {
      window.removeEventListener("mousemove", move);
      hovers.forEach((el) => {
        el.removeEventListener("mouseenter", add);
        el.removeEventListener("mouseleave", rm);
      });
    };
  }, []);

  // Scroll progress circle
  useEffect(() => {
    const path = progressPathRef.current;
    if (!path) return;
    const pathLength = path.getTotalLength();

    path.style.strokeDasharray = `${pathLength} ${pathLength}`;
    path.style.strokeDashoffset = String(pathLength);

    const updateProgress = () => {
      const scroll = window.pageYOffset;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = pathLength - (scroll * pathLength) / (height || 1);
      path.style.strokeDashoffset = String(progress);
      if (progressWrapRef.current) {
        progressWrapRef.current.classList.toggle("active-progress", scroll > 100);
      }
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress);
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // Helper to transform YouTube short link to embed
  const videoUrl = "https://www.youtube.com/embed/AzwC6umvd1s?autoplay=1&rel=0";

  return (
    <div className="home-main-crev main-bg">
      {/* Loader (static mock; hook up if you need real loading state) */}
      <div className="loader-wrap" aria-hidden>
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none">
          <path id="svg" d="M0,1005S175,995,500,995s500,5,500,5V0H0Z"></path>
        </svg>
        <div className="loader-wrap-heading">
          <div className="load-text">
            {"Loading".split("").map((c, i) => (
              <span key={i}>{c}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Custom cursor */}
      <div className="cursor" ref={cursorRef} />

      {/* Scroll progress button */}
      <div className="progress-wrap cursor-pointer" ref={progressWrapRef} onClick={scrollToTop} role="button" aria-label="Scroll to top">
        <svg className="progress-circle svg-content" width="100%" height="100%" viewBox="-1 -1 102 102">
          <path ref={progressPathRef} d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" />
        </svg>
      </div>

      {/* Page content */}
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main className="main-bg">
            {/* Header / Hero */}
            <header className="crev-header">
              <div className="container mt-80">
                <div className="row">
                  <div className="col-lg-9">

                    <div className="rotated-circle">
                    <span>Lets!</span>
                    </div>
                    <br/>
                    <span>Start Project</span>
                    <div className="rotating-circle">
                    <span>Start Project</span>
                    </div>

                    <div className="caption">
                      <h1>
                        High End <br /> <span className="stroke">Creative</span> Agency
                      </h1>
                      <div className="row mt-30">
                        <div className="col-lg-5 offset-lg-1">
                          <div className="text">
                            <p>
                              Through our years of experience, we've also learned that while each channel has its own set of advantages.
                            </p>
                          </div>
                          <div className="crv-butn-vid mt-30">
                            <button className="vid btn btn-link p-0 text-decoration-none" onClick={() => setShowVideo(true)}>
                              <span className="text sub-title">Watch</span>
                              <span className="icon main-colorbg4">
                                <svg className="default" width="13" height="20" viewBox="0 0 13 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M0 20L13 10L0 0V20Z"></path>
                                </svg>
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 d-none d-lg-block">
                    <a href="#about" className="hover-this text-decoration-none">
                      <div className="circle-button in-bord hover-anim">
                        <div className="rotate-circle fz-30 text-u">
                          <svg className="textcircle" viewBox="0 0 500 500">
                            <defs>
                              <path id="textcircle" d="M250,400 a150,150 0 0,1 0,-300a150,150 0 0,1 0,300Z"></path>
                            </defs>
                            <text>
                              <textPath xlinkHref="#textcircle" textLength="900">
                                Explore More - Explore More -
                              </textPath>
                            </text>
                          </svg>
                        </div>
                        <div className="arrow">
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.922 4.5V11.8125C13.922 11.9244 13.8776 12.0317 13.7985 12.1108C13.7193 12.1899 13.612 12.2344 13.5002 12.2344C13.3883 12.2344 13.281 12.1899 13.2018 12.1108C13.1227 12.0317 13.0783 11.9244 13.0783 11.8125V5.51953L4.79547 13.7953C4.71715 13.8736 4.61092 13.9176 4.50015 13.9176C4.38939 13.9176 4.28316 13.8736 4.20484 13.7953C4.12652 13.717 4.08252 13.6108 4.08252 13.5C4.08252 13.3892 4.12652 13.283 4.20484 13.2047L12.4806 4.92188H6.18765C6.07577 4.92188 5.96846 4.87743 5.88934 4.79831C5.81023 4.71919 5.76578 4.61189 5.76578 4.5C5.76578 4.38811 5.81023 4.28081 5.88934 4.20169C5.96846 4.12257 6.07577 4.07813 6.18765 4.07812H13.5002C13.612 4.07813 13.7193 4.12257 13.7985 4.20169C13.8776 4.28081 13.922 4.38811 13.922 4.5Z" fill="currentColor"></path>
                          </svg>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
              <div className="main-img">
                <img src={bgImage} alt="Creative agency background" />
              </div>
              <div
                  className="bg-pattern bg-img"
                  style={{ backgroundImage: `url(${pattern})` }}
              ></div>
            </header>

            {/* Marquee */}
            <section className="marquee">
              <div className="container-fluid rest">
                <div className="row">
                  <div className="col-12">
                    <div className="main-marq">
                      <div className="slide-har st1">
                        <MarqueeBox />
                        <MarqueeBox />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>

        <AppCircle />
        <AppCirclePath />
        <AppCircleLogo />

        </div>
      </div>

      {/* Simple lightbox for video (no jQuery) */}
      {showVideo && (
        <div className="ytp-wrap" onClick={() => setShowVideo(false)}>
          <div className="ytp-content animated fadeIn" onClick={(e) => e.stopPropagation()}>
            <button className="ytp-close" onClick={() => setShowVideo(false)} aria-label="Close video">×</button>
            <iframe
              title="Geekfolio video"
              src={videoUrl}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Styles (merged/adapted from provided CSS)  
      <style>{`
        :root { --bg-dark: #1d1d1d; }
        .main-bg { background-color: var(--bg-dark); color: #fff; }
        .mt-80 { margin-top: 80px; }
        .mt-30 { margin-top: 30px; }
        .stroke { color: transparent; -webkit-text-stroke: 1px #fff; text-stroke: 1px #fff; }

       
        .loader-wrap { position: fixed; inset: 0; background: #111; display: none; align-items: center; justify-content: center; z-index: 9990; }
        .loader-wrap svg { position: absolute; bottom: 0; left: 0; width: 100%; height: 40%; fill: #0e0e0e; }
        .loader-wrap .load-text span { display: inline-block; margin: 0 1px; font-weight: 600; letter-spacing: 2px; }

 
        .cursor { pointer-events: none; position: fixed; padding: 0.3rem; background-color: #fff; border-radius: 50%; mix-blend-mode: difference; transition: transform .3s ease, opacity .4s ease; z-index: 99999; transform: translate(-50%, -50%) scale(1); }
        .cursor-active { transform: translate(-50%, -50%) scale(8); opacity: .1; }


        .progress-wrap { position: fixed; right: 20px; bottom: 20px; height: 46px; width: 46px; cursor: pointer; display: grid; place-items: center; opacity: 0; visibility: hidden; transition: .3s ease; z-index: 10000; }
        .progress-wrap.active-progress { opacity: 1; visibility: visible; }
        .progress-circle path { stroke: #fff; stroke-width: 2; fill: none; }

       
        .crev-header { padding-top: 80px; }
        .crev-header .caption h1 { font-size: 60px; font-weight: 800; line-height: 1.1; }
        @media (max-width: 992px){ .crev-header .caption h1 { font-size: 35px; } }
        .crev-header .main-img { width: 100%; margin-top: 50px; }
        .crev-header .main-img img { width: 100%; height: auto; border-radius: 12px; }

        .crv-butn-vid .vid { min-width: 120px; padding-left: 15px; padding-right: 40px; height: 50px; border: 1px solid #eee; border-radius: 30px; position: relative; color: #fff; }
        .crv-butn-vid .vid .text { line-height: 50px; }
        .crv-butn-vid .vid .icon { position: absolute; top: 2px; right: 2px; width: 45px; height: 45px; border-radius: 50%; text-align: center; line-height: 48px; background: #666; }

      
        .circle-button { position: relative; display: inline-block; }
        .circle-button.in-bord:after { content: ''; position: absolute; top: 55px; left: 55px; right: 55px; bottom: 55px; border: 1px solid rgba(255,255,255,.5); border-radius: 50%; }
        .circle-button.in-bord:before { content: ''; position: absolute; top: 15px; left: 15px; right: 15px; bottom: 15px; border: 1px solid rgba(255,255,255,.5); border-radius: 50%; }
        .circle-button .rotate-circle svg { width: 210px; fill: #fff; }
        .circle-button .arrow { position: absolute; top: 50%; left: 50%; transform: translate(-20px, -20px); }

        .rotate-circle { animation: rotateCircle 20s linear infinite; }
        @keyframes rotateCircle { from { transform: rotate(0); } to { transform: rotate(360deg); } }

      
        .marquee { position: relative; overflow: hidden; padding: 50px 0; border-top: 1px solid rgba(255,255,255,.2); border-bottom: 1px solid rgba(255,255,255,.2); transform: rotate(-3deg); width: calc(100% + 60px); margin-left: -30px; background: #1d1d1d; }
        .marquee:before { content: ''; position: absolute; inset: 0 -30px; background: linear-gradient(to left, #1d1d1d, transparent 300px, transparent calc(100% - 300px), #1d1d1d); z-index: 3; }
        .main-marq { position: relative; padding: 0; }
        .main-marq .slide-har { display: flex; }
        .main-marq .box { display: flex; }
        .main-marq .box .item { padding: 0 30px; }
        .main-marq .box .item h4 { white-space: nowrap; line-height: 1; margin: 0; font-size: 70px; }
        @media (max-width: 992px){ .main-marq .box .item h4 { font-size: 42px; } }
        .slide-har.st1 .box { animation: slide-har 80s linear infinite; }
        @keyframes slide-har { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }
        .main-marq .non-strok .item h4 { color: #fff; -webkit-text-stroke: 0; }

      
        .ytp-wrap { position: fixed; inset: 0; background: rgba(0,0,0,.85); z-index: 100000; display: grid; place-items: center; }
        .ytp-content { position: relative; width: min(900px, 92vw); aspect-ratio: 16/9; }
        .ytp-content iframe { position: absolute; inset: 0; width: 100%; height: 100%; }
        .ytp-close { position: absolute; right: -12px; top: -12px; width: 36px; height: 36px; border-radius: 50%; border: 0; background: #fff; color: #000; font-size: 20px; line-height: 36px; text-align: center; cursor: pointer; }
      `}</style> */}
    </div>
  );
}

function MarqueeBox() {
  return (
    <div className="box non-strok">
      {[
        "UI-UX Experience",
        "Web Development",
        "Digital Marketing",
        "Product Design",
        "Mobile Solutions",
      ].map((text, idx) => (
        <div className="item" key={idx}>
          <h4 className="d-flex align-items-center">
            <span>{text}</span>
            <span className="fz-50 ms-5 stroke icon">*</span>
          </h4>
        </div>
      ))}
    </div>
  );
}
