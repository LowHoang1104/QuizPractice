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
import UserDetailPage from './features/admin/UserDetailPage';
import SettingDetailPage from './features/admin/SettingDetailPage';
import PostsList from './features/marketing/PostsList';
import SlidersList from './features/marketing/SlidersList';
import PostDetailPage from './features/marketing/PostDetailPage';
import SliderDetailPage from './features/marketing/SliderDetailPage';
import MarketingDashboard from './features/marketing/Dashboard';
import SaleDashboard from './features/sale/SaleDashboard';
import RegistrationsList from './features/sale/RegistrationsList';
import RegistrationDetailPage from './features/sale/RegistrationDetailPage';
import SubjectsList from './features/expert/SubjectsList';
import SubjectDetail from './features/expert/SubjectDetail';
import NewSubjectPage from './features/expert/NewSubjectPage';
import SubjectLessonsPage from './features/expert/SubjectLessonsPage';
import LessonDetailPage from './features/expert/LessonDetailPage';
import SubjectQuestionsPage from './features/expert/SubjectQuestionsPage';
import QuestionDetailPage from './features/expert/QuestionDetailPage';
import QuestionImportPage from './features/expert/QuestionImportPage';
import SubjectQuizzesPage from './features/expert/SubjectQuizzesPage';
import QuizDetailPage from './features/expert/QuizDetailPage';
import PracticesList from './features/customer/PracticesList';
import PracticeDetailPage from './features/customer/PracticeDetailPage';
import BlogsListPage from './features/home/BlogsListPage';
import BlogDetailPage from './features/home/BlogDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="blogs" element={<BlogsListPage />} />
        <Route path="blogs/:id" element={<BlogDetailPage />} />
        <Route path="/subjects" element={<SubjectsPage />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="profile" element={<ProfilePage />} />
          <Route path="admin/dashboard" element={<AdminDashboard />} />
          <Route path="admin/users" element={<UsersList />} />
          <Route path="admin/users/:id" element={<UserDetailPage />} />
          <Route path="admin/settings" element={<SettingsList />} />
          <Route path="admin/settings/:id" element={<SettingDetailPage />} />
          <Route path="marketing/dashboard" element={<MarketingDashboard />} />
          <Route path="marketing/posts" element={<PostsList />} />
          <Route path="marketing/posts/:id" element={<PostDetailPage />} />
          <Route path="marketing/sliders" element={<SlidersList />} />
          <Route path="marketing/sliders/:id" element={<SliderDetailPage />} />
          <Route path="sale/dashboard" element={<SaleDashboard />} />
          <Route path="sale/registrations" element={<RegistrationsList />} />
          <Route path="sale/registrations/:id" element={<RegistrationDetailPage />} />
          <Route path="expert/subjects" element={<SubjectsList />} />
          <Route path="expert/subjects/new" element={<NewSubjectPage />} />
          <Route path="expert/subjects/:id" element={<SubjectDetail />} />
          <Route path="expert/subjects/:id/lessons" element={<SubjectLessonsPage />} />
          <Route path="expert/lessons/:id" element={<LessonDetailPage />} />
          <Route path="expert/subjects/:id/questions" element={<SubjectQuestionsPage />} />
          <Route path="expert/questions/:id" element={<QuestionDetailPage />} />
          <Route path="expert/subjects/:id/questions/import" element={<QuestionImportPage />} />
          <Route path="expert/subjects/:id/quizzes" element={<SubjectQuizzesPage />} />
          <Route path="expert/quizzes/:id" element={<QuizDetailPage />} />
          <Route path="customer/my-registrations" element={<Navigate to="/customer/practices" replace />} />
          <Route path="customer/practices" element={<PracticesList />} />
          <Route path="customer/practices/:id" element={<PracticeDetailPage />} />
        </Route>
        <Route path="/quiz/practice/:id" element={<ProtectedRoute><QuizPracticePage /></ProtectedRoute>} />
        <Route path="/quiz/result/:resultId" element={<ProtectedRoute><QuizResultPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
