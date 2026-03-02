import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './layouts/AppLayout';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import ForgotPasswordPage from './features/auth/ForgotPasswordPage';
import ProfilePage from './features/auth/ProfilePage';
import HomePage from './features/home/HomePage';
import SubjectsPage from './features/subjects/SubjectsPage';
import QuizPracticePage from './features/quiz/QuizPracticePage';
import QuizResultPage from './features/quiz/QuizResultPage';
import AdminDashboard from './features/admin/AdminDashboard';
import UsersList from './features/admin/UsersList';
import SettingsList from './features/admin/SettingsList';
import PostsList from './features/marketing/PostsList';
import SlidersList from './features/marketing/SlidersList';
import MarketingDashboard from './features/marketing/Dashboard';
import SaleDashboard from './features/sale/SaleDashboard';
import RegistrationsList from './features/sale/RegistrationsList';
import SubjectsList from './features/expert/SubjectsList';
import SubjectDetail from './features/expert/SubjectDetail';
import MyRegistrations from './features/customer/MyRegistrations';
import PracticesList from './features/customer/PracticesList';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/subjects" element={<SubjectsPage />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="profile" element={<ProfilePage />} />
          <Route path="admin/dashboard" element={<AdminDashboard />} />
          <Route path="admin/users" element={<UsersList />} />
          <Route path="admin/settings" element={<SettingsList />} />
          <Route path="marketing/dashboard" element={<MarketingDashboard />} />
          <Route path="marketing/posts" element={<PostsList />} />
          <Route path="marketing/sliders" element={<SlidersList />} />
          <Route path="sale/dashboard" element={<SaleDashboard />} />
          <Route path="sale/registrations" element={<RegistrationsList />} />
          <Route path="expert/subjects" element={<SubjectsList />} />
          <Route path="expert/subjects/:id" element={<SubjectDetail />} />
          <Route path="customer/my-registrations" element={<MyRegistrations />} />
          <Route path="customer/practices" element={<PracticesList />} />
        </Route>
        <Route path="/quiz/practice/:id" element={<ProtectedRoute><QuizPracticePage /></ProtectedRoute>} />
        <Route path="/quiz/result/:resultId" element={<ProtectedRoute><QuizResultPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
