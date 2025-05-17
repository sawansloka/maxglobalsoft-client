import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import Login from './pages/Login';
import BannerList from './pages/home/BannerList';
import BannerForm from './pages/home/BannerForm';
import CompanyValueList from './pages/home/CompanyValueList';
import CompanyValueForm from './pages/home/CompanyValueForm';
import ServiceList from './pages/home/ServiceList';
import ServiceForm from './pages/home/ServiceForm';
import SubscriptionList from './pages/home/SubscriptionList';
import SubscriptionForm from './pages/home/SubscriptionForm';
import ClientSpeakList from './pages/company/clientSpeakList';
import ClientSpeakForm from './pages/company/clientSpeakForm';
import newsEventList from './pages/company/newsEventList';
import newsEventForm from './pages/company/newsEventForm';

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
            <Route path="/admin/home/banners" element={<BannerList />} />
            <Route path="/admin/home/banners/new" element={<BannerForm />} />
            <Route path="/admin/home/banners/:id" element={<BannerForm />} />

            <Route path="/admin/home/company-values" element={<CompanyValueList />} />
            <Route path="/admin/home/company-values/new" element={<CompanyValueForm />} />
            <Route path="/admin/home/company-values/:id" element={<CompanyValueForm />} />

            <Route path="/admin/home/services" element={<ServiceList />} />
            <Route path="/admin/home/services/new" element={<ServiceForm />} />
            <Route path="/admin/home/services/:id" element={<ServiceForm />} />

            <Route path="/admin/home/subscriptions" element={<SubscriptionList />} />
            <Route path="/admin/home/subscription/new" element={<SubscriptionForm />} />
            <Route path="/admin/home/subscription/:id" element={<SubscriptionForm />} />

            <Route path="/admin/company/clientspeak" element={<ClientSpeakList />} />
            <Route path="/admin/company/clientspeak/new" element={<ClientSpeakForm />} />
            <Route path="/admin/company/clientspeak/:id" element={<ClientSpeakForm />} />

            <Route path="/admin/company/eventandnews" element={<newsEventList />} />
            <Route path="/admin/company/eventandnews/new" element={<newsEventForm />} />
            <Route path="/admin/company/eventandnews/:id" element={<newsEventForm />} />

            {/* add other “manage” routes here */}
          </Route>

          {/* Redirect to /admin/home/banners as the default protected route */}
          <Route path="/" element={<Navigate to="/admin/home/banners" replace />} />
          <Route path="*" element={<Navigate to="/admin/home/banners" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;