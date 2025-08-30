// client/src/TrelloApp.jsx
// Main React component setting up routing and contexts
import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';
// import { SocketProvider } from './context/SocketContext'; // Removed for now
// import PrivateRoute from './components/PrivateRoute';
// import AuthPage from './pages/AuthPage';
import TrelloDashboardPage from './TrelloDashboardPage';
import BoardDetailsPage from './BoardDetailsPage'; // NEW: Import BoardDetailsPage
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import './TrelloApp.css'


function TrelloApp() {
    return (
      <>
      {/*  <Router>
            <AuthProvider>
                 <SocketProvider> // Removed for now
                    <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    /> */}
                  {/*   <Routes> */}
                    {/*}    <Route path="/auth" element={<AuthPage />} />
                        <Route path="/" element={<PrivateRoute />}>
                            {/* Protected routes */}
                          {/*  <Route path="/trello-board" element={<TrelloDashboardPage />} />
                            <Route path="/board/:boardId" element={<BoardDetailsPage />} /> {/* NEW: Board Details Route */}
                          {/*}  <Route path="/" element={<Navigate to="/dashboard" replace />} /> {/* Redirect root to dashboard if authenticated */}
                      {/*  </Route> */}
                        {/* Fallback for unmatched routes */}
                    {/*    <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes> */}
                {/* </SocketProvider> // Removed for now
            </AuthProvider>
        </Router> */}
        </>
    );
}

export default TrelloApp;
