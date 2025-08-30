import React, { useRef } from "react";
// import { BrowserRouter } from "react-browser-router";
import { BrowserRouter } from "react-router-dom";
import Header from "../../components/home/Header";
import Navbar from "../../components/home/Navbar";
import "./styles.css";
import NavbarAlt from "../../components/home/NavbarAlt";
import NavbarUI from "../../components/home/NavbarUI";
import VerticalSwiperDemo from "../../components/home/VerticalSwiperDemo";
import CrissCrossSwiperDemo from "../../components/home/CrissCrossSwiperDemo";



const Home = () => {

  const nav = useRef();

  const scrollTop = () => {
      nav.current?.scrollIntoView({behavior: 'smooth'});
  }

  return (
    //<BrowserRouter>
      <div className='home' >
       {/* <Header /> */}
        <NavbarUI nav={nav}  />
        <Header />
        {/*<NavbarAlt />*/}
         {/* 
         <Navbar />
        <Slide />
        <LatestTrek />
        <Motivation />
        <Video />
        <Reviews />
       
        <TestimonialsMultiPage />
        */}

      <div className="container-fluid my-4">
        <h3>Criss Cross Swiper</h3>
       {/*< VerticalSwiperDemo />*/}
       <CrissCrossSwiperDemo />
      </div>

      </div>
    //</BrowserRouter>
  )
}

export default Home