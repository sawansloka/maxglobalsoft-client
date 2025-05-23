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
import NewsEventList from './pages/company/newsEventList';
import NewsEventForm from './pages/company/newsEventForm';
import CareerList from './pages/company/careerList';
import CareerForm from './pages/company/careerForm';
import SocialNetworkList from './pages/company/socialNetworkList';
import SocialNetworkForm from './pages/company/socialNetworkForm';
import ProjectList from './pages/portfolio/projectList';
import ProjectForm from './pages/portfolio/projectForm';
import ProjectCategoryList from './pages/portfolio/projectCategoryList';
import ProjectCategoryForm from './pages/portfolio/projectCategoryForm';
import ClientList from './pages/partner/clientList';
import ClientForm from './pages/partner/clientForm';
import PartnerList from './pages/partner/partnerList';
import PartnerForm from './pages/partner/partnerForm';
import PageList from './pages/page/pageList';
import PageForm from './pages/page/pageForm';
import MenuList from './pages/page/menuList';
import MenuForm from './pages/page/menuForm';
import ApplicationList from './pages/application/applicationList';
import ApplicationForm from './pages/application/applicationForm';

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

            <Route path="/admin/company/client-speak" element={<ClientSpeakList />} />
            <Route path="/admin/company/client-speak/new" element={<ClientSpeakForm />} />
            <Route path="/admin/company/client-speak/:id" element={<ClientSpeakForm />} />

            <Route path="/admin/company/event-news" element={<NewsEventList />} />
            <Route path="/admin/company/event-news/new" element={<NewsEventForm />} />
            <Route path="/admin/company/event-news/:id" element={<NewsEventForm />} />

            <Route path="/admin/company/career" element={<CareerList />} />
            <Route path="/admin/company/career/new" element={<CareerForm />} />
            <Route path="/admin/company/career/:id" element={<CareerForm />} />

            <Route path="/admin/company/follow-us" element={<SocialNetworkList />} />
            <Route path="/admin/company/follow-us/new" element={<SocialNetworkForm />} />
            <Route path="/admin/company/followus/:id" element={<SocialNetworkForm />} />

            <Route path="/admin/portfolio/project" element={<ProjectList />} />
            <Route path="/admin/portfolio/project/new" element={<ProjectForm />} />
            <Route path="/admin/portfolio/project/:id" element={<ProjectForm />} />

            <Route path="/admin/portfolio/project-category" element={<ProjectCategoryList />} />
            <Route path="/admin/portfolio/project-category/new" element={<ProjectCategoryForm />} />
            <Route path="/admin/portfolio/project-category/:id" element={<ProjectCategoryForm />} />

            <Route path="/admin/partner/client" element={<ClientList />} />
            <Route path="/admin/partner/client/new" element={<ClientForm />} />
            <Route path="/admin/partner/client/:id" element={<ClientForm />} />

            <Route path="/admin/partner/partner" element={<PartnerList />} />
            <Route path="/admin/partner/partner/new" element={<PartnerForm />} />
            <Route path="/admin/partner/partner/:id" element={<PartnerForm />} />

            <Route path="/admin/page/page" element={<PageList />} />
            <Route path="/admin/page/page/new" element={<PageForm />} />
            <Route path="/admin/page/page/:id" element={<PageForm />} />

            <Route path="/admin/page/menu" element={<MenuList />} />
            <Route path="/admin/page/menu/new" element={<MenuForm />} />
            <Route path="/admin/page/menu/:id" element={<MenuForm />} />

            <Route path="/admin/application/job-application" element={<ApplicationList />} />
            <Route path="/admin/application/job-application/new" element={<ApplicationForm />} />
            <Route path="/admin/application/job-application/:id" element={<ApplicationForm />} />

          </Route>

          <Route path="/" element={<Navigate to="/admin/home/banners" replace />} />
          <Route path="*" element={<Navigate to="/admin/home/banners" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;