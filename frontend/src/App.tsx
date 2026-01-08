import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import QuestionsPage from './pages/QuestionsPage';
import QuestionDetailPage from './pages/QuestionDetailPage';
import CreateQuestionPage from './pages/CreateQuestionPage';
import EditQuestionPage from './pages/EditQuestionPage';
import MyQuestionsPage from './pages/MyQuestionsPage';
import ProfilePage from './pages/ProfilePage';
import MyProfilePage from './pages/MyProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import BookmarksPage from './pages/BookmarksPage';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminTagsPage from './pages/admin/AdminTagsPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/questions" element={<QuestionsPage />} />
            <Route path="/questions/:id" element={<QuestionDetailPage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />

            <Route path="/questions/new" element={
              <ProtectedRoute>
                <CreateQuestionPage />
              </ProtectedRoute>
            } />
            <Route path="/questions/:id/edit" element={
              <ProtectedRoute>
                <EditQuestionPage />
              </ProtectedRoute>
            } />
            <Route path="/my/questions" element={
              <ProtectedRoute>
                <MyQuestionsPage />
              </ProtectedRoute>
            } />
            <Route path="/me" element={
              <ProtectedRoute>
                <MyProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <MyProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/profile/edit" element={
              <ProtectedRoute>
                <EditProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            } />
            <Route path="/bookmarks" element={
              <ProtectedRoute>
                <BookmarksPage />
              </ProtectedRoute>
            } />

            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="/admin/users" element={
              <AdminRoute>
                <AdminUsersPage />
              </AdminRoute>
            } />
            <Route path="/admin/reports" element={
              <AdminRoute>
                <AdminReportsPage />
              </AdminRoute>
            } />
            <Route path="/admin/tags" element={
              <AdminRoute>
                <AdminTagsPage />
              </AdminRoute>
            } />
            <Route path="/admin/categories" element={
              <AdminRoute>
                <AdminCategoriesPage />
              </AdminRoute>
            } />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
