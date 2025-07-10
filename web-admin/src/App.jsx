import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import MemberManagement from './components/MemberManagement';
import MemberDetail from './components/MemberDetail';
import MemberForm from './components/MemberForm';
import AssetManagement from './components/AssetManagement';
import OrganizationManagement from './components/OrganizationManagement';
import RosterManagement from './components/RosterManagement';
import PasswordManagement from './components/PasswordManagement';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <Router basename="/admin">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={
                        <ProtectedRoute><Layout><Navigate to="/dashboard" replace /></Layout></ProtectedRoute>
                    } />
                    <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
                    <Route path="/users" element={<ProtectedRoute><Layout><MemberManagement /></Layout></ProtectedRoute>} />
                    <Route path="/users/:userId" element={<ProtectedRoute><Layout><MemberDetail /></Layout></ProtectedRoute>} />
                    <Route path="/users/new" element={<ProtectedRoute><Layout><MemberForm /></Layout></ProtectedRoute>} />
                    <Route path="/users/edit/:userId" element={<ProtectedRoute><Layout><MemberForm /></Layout></ProtectedRoute>} />
                    <Route path="/assets" element={<ProtectedRoute><Layout><AssetManagement /></Layout></ProtectedRoute>} />
                    <Route path="/organization" element={<ProtectedRoute><Layout><OrganizationManagement /></Layout></ProtectedRoute>} />
                    <Route path="/rosters" element={<ProtectedRoute><Layout><RosterManagement /></Layout></ProtectedRoute>} />
                    <Route path="/password" element={<ProtectedRoute><Layout><PasswordManagement /></Layout></ProtectedRoute>} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}
export default App;
