import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import Login from './pages/Login';
import BannerList from './pages/home/BannerList';
import BannerForm from './pages/home/BannerForm';
import CompanyValueList from './pages/home/CompanyValueList';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 1) Public login */}
          <Route path="/admin/login" element={<Login />} />

          {/* 2) Protected admin area */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="banners" element={<BannerList />} />
            <Route path="company-values" element={<CompanyValueList />} />
            <Route path="banners/new" element={<BannerForm />} />
            <Route path="banners/:id" element={<BannerForm />} />
            {/* add other “manage” routes here */}
          </Route>

          <Route path="*" element={<Navigate to="/banners" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
