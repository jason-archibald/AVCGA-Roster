import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout'; import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage'; import DashboardPage from './pages/DashboardPage'; import CalendarPage from './pages/CalendarPage';
function App() { return (<Layout><Routes><Route path="/login" element={<LoginPage />} /><Route path="/" element={<Navigate to="/dashboard" replace />} /><Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} /><Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} /></Routes></Layout>); }
export default App;
