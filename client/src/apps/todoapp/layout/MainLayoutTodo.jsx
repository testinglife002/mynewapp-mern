import React from 'react';
import Sidebar from './Sidebar';
import NavbarTop from './NavbarTop';
import Footer from './Footer';
import FloatingAction from './FloatingAction';
import './layout.css';

const MainLayoutTodo = ({ children }) => {
  return (
    <div className="d-flex app-layout">
      <Sidebar />
      <div className="main-content flex-grow-1 d-flex flex-column">
        <NavbarTop />
        <main className="p-4 flex-grow-1 content-area">
          {children}
        </main>
        <Footer />
        <FloatingAction />
      </div>
    </div>
  );
};

export default MainLayoutTodo;
