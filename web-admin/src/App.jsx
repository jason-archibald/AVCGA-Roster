import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UserListPage from './pages/UserListPage';
import UserDetailPage from './pages/UserDetailPage';
import UserFormPage from './pages/UserFormPage';
import AssetPage from './pages/AssetPage';
import OrganizationPage from './pages/OrganizationPage';
import RosterPage from './pages/RosterPage';
import RosterDetailPage from './pages/RosterDetailPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><UserListPage /></ProtectedRoute>} />
        <Route path="/users/:userId" element={<ProtectedRoute><UserDetailPage /></ProtectedRoute>} />
        <Route path="/users/new" element={<ProtectedRoute><UserFormPage /></ProtectedRoute>} />
        <Route path="/users/edit/:userId" element={<ProtectedRoute><UserFormPage /></ProtectedRoute>} />
        <Route path="/assets" element={<ProtectedRoute><AssetPage /></ProtectedRoute>} />
        <Route path="/organization" element={<ProtectedRoute><OrganizationPage /></ProtectedRoute>} />
        <Route path="/rosters" element={<ProtectedRoute><RosterPage /></ProtectedRoute>} />
        <Route path="/rosters/:rosterId" element={<ProtectedRoute><RosterDetailPage /></ProtectedRoute>} />
      </Routes>
    </Layout>
  );
}

export default App;
