import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UserListPage from './pages/UserListPage';
import UserDetailPage from './pages/UserDetailPage';
import UserFormPage from './pages/UserFormPage'; // For New and Edit
import RosterPage from './pages/RosterPage';
// Add imports for other pages if they exist
import AssetPage from './pages/AssetPage';
import OrgPage from './pages/OrgPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><UserListPage /></ProtectedRoute>} />
        <Route path="/users/:userId" element={<ProtectedRoute><UserDetailPage /></ProtectedRoute>} />
        <Route path="/users/new" element={<ProtectedRoute><UserFormPage /></ProtectedRoute>} />
        <Route path="/users/edit/:userId" element={<ProtectedRoute><UserFormPage /></ProtectedRoute>} />
        <Route path="/rosters" element={<ProtectedRoute><RosterPage /></ProtectedRoute>} />
        <Route path="/assets" element={<ProtectedRoute><AssetPage/></ProtectedRoute>} />
        <Route path="/organization" element={<ProtectedRoute><OrgPage/></ProtectedRoute>} />
      </Routes>
    </Layout>
  );
}
export default App;
