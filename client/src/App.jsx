import './App.css'
import Home from './components/Home.jsx'
import PostPage from './components/PostPage.jsx'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from "sonner";
import Signup from './components/Signup.jsx'
import Login from './components/Login.jsx'
import AdminArticleManagementPage from './components/admin/AdminArticlePage.jsx'
import AdminCreateArticlePage from './components/admin/AdminCreateArticle.jsx'
import AdminEditArticlePage from './components/admin/AdminEditArticlePage.jsx'
import AdminCategoryManagementPage from './components/admin/AdminCategoryPage.jsx'
import AdminCreateCategoryPage from './components/admin/AdminCreateCategoryPage.jsx'
import AdminEditCategoryPage from './components/admin/AdminEditCategoryPage.jsx'
import AdminProfilePage from './components/admin/AdminProfilePage.jsx'
import AdminNotificationPage from './components/admin/AdminNotificationPage.jsx'
import AdminResetPasswordPage from './components/admin/AdminResetPasswordPage.jsx'
import NotFoundPage from './components/NotFoundPage.jsx';
import ProfileManagement from './components/ProfileManagement.jsx';
import ResetPassword from './components/ResetPassword.jsx';
import jwtInterceptor from './utils/jwtInterceptor.jsx';
import { useAuth } from './context/Authentication';
import AuthenticationRoute from './context/AuthenticationRoute.jsx';
import ProtectedRoute from './context/ProtectedRoute.jsx';

jwtInterceptor();

function App() {
  const { isAuthenticated, state } = useAuth();

  return (
    <>
    <Toaster
      richColors
      position="bottom-right"
      toastOptions={{
        success: {
          style: {
            background: '#12B279',
            color: '#ffffff',
          },
        },
        error: {
          style: {
            background: '#EB5164',
            color: '#ffffff',
          },
        },
        info: {
          style: {
            background: '#12B279',
            color: '#ffffff',
          },
        },
      }}
    />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/posts/:id" element={<PostPage />} />
      <Route
          path="/signup"
          element={
            <AuthenticationRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
            >
              <Signup />
            </AuthenticationRoute>
          }
        /> 
      <Route
          path="/login"
          element={
            <AuthenticationRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
            >
              <Login />
            </AuthenticationRoute>
          }
        />
      <Route path="*" element={<NotFoundPage />} />
      <Route
          path="/profile"
          element={
            <ProtectedRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
              userRole={state.user?.role}
              requiredRole="user"
            >
              <ProfileManagement />
            </ProtectedRoute>
          }
        />
      <Route path="/resetpassword" element={<ResetPassword />} />
      <Route
          path="/admin/article-management"
          element={
            <ProtectedRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
              userRole={state.user?.role}
              requiredRole="admin"
            >
              <AdminArticleManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/article-management/create"
          element={
            <ProtectedRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
              userRole={state.user?.role}
              requiredRole="admin"
            >
              <AdminCreateArticlePage />  
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/article-management/edit/:postId"
          element={
            <ProtectedRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
              userRole={state.user?.role}
              requiredRole="admin"
            >
            <AdminEditArticlePage />  
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/category-management"
          element={
            <ProtectedRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
              userRole={state.user?.role}
              requiredRole="admin"
            >
              <AdminCategoryManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/category-management/create"
          element={
            <ProtectedRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
              userRole={state.user?.role}
              requiredRole="admin"
            >
              <AdminCreateCategoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/category-management/edit/:categoryId"
          element={
            <ProtectedRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
              userRole={state.user?.role}
              requiredRole="admin"
            >
              <AdminEditCategoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
              userRole={state.user?.role}
              requiredRole="admin"
            >
              <AdminProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/notification"
          element={
            <ProtectedRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
              userRole={state.user?.role}
              requiredRole="admin"
            >
              <AdminNotificationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reset-password"
          element={
            <ProtectedRoute
              isLoading={state.getUserLoading}
              isAuthenticated={isAuthenticated}
              userRole={state.user?.role}
              requiredRole="admin"
            >
              <AdminResetPasswordPage />
            </ProtectedRoute>
          }
        />
    </Routes>
    </>
  )
}

export default App
