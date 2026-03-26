import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentManagement from './pages/StudentManagement';
import AttendanceMarking from './pages/AttendanceMarking';
import AttendanceRecords from './pages/AttendanceRecords';
import Analytics from './pages/Analytics';
import './index.css';

const App = () => {
    const isAuthenticated = !!localStorage.getItem('userInfo');

    return (
        <Router>
            <div className="app-container">
                {isAuthenticated && <Sidebar />}
                <div className={isAuthenticated ? "main-content" : "full-content"}>
                    {isAuthenticated && <Navbar />}
                    <div className="page-wrapper">
                        <Routes>
                            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
                            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
                            <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
                            <Route path="/students" element={isAuthenticated ? <StudentManagement /> : <Navigate to="/login" />} />
                            <Route path="/attendance" element={isAuthenticated ? <AttendanceMarking /> : <Navigate to="/login" />} />
                            <Route path="/records" element={isAuthenticated ? <AttendanceRecords /> : <Navigate to="/login" />} />
                            <Route path="/analytics" element={isAuthenticated ? <Analytics /> : <Navigate to="/login" />} />
                        </Routes>
                    </div>
                </div>
            </div>
            <style>{`
                .app-container {
                    display: flex;
                    min-height: 100vh;
                }
                .main-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    margin-left: var(--sidebar-width);
                    transition: margin 0.3s ease;
                }
                .full-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }
                .page-wrapper {
                    padding: 2rem;
                    flex: 1;
                }
                @media (max-width: 768px) {
                    .main-content {
                        margin-left: 0;
                    }
                }
            `}</style>
        </Router>
    );
};

export default App;
