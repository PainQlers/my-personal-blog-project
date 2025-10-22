import './App.css'
import Home from './components/Home.jsx'
import PostPage from './components/PostPage.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
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

function App() {
  return (
    <>
    <Toaster
      richColors
      position="bottom-right"
      toastOptions={{
        style: {
          background: '#12B279',
          color: '#fff',
        },
        success: {
          style: {
            background: '#12B279',
            color: '#fff',
          },
        },
        error: {
          style: {
            background: '#12B279',
            color: '#fff',
          },
        },
        info: {
          style: {
            background: '#12B279',
            color: '#fff',
          },
        },
      }}
    />
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/posts/:id" element={<PostPage />} />  
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/profile" element={<ProfileManagement />} />
      <Route path="resetpassword" element={<ResetPassword />} />
      <Route
            path="/admin/article-management"
            element={<AdminArticleManagementPage />}
          />
      <Route
            path="/admin/article-management/create"
            element={<AdminCreateArticlePage />}
          />
      <Route
            path="/admin/article-management/edit/:postId"
            element={<AdminEditArticlePage />}
          />
      <Route
            path="/admin/category-management"
            element={<AdminCategoryManagementPage />}
          />
      <Route
            path="/admin/category-management/create"
            element={<AdminCreateCategoryPage />}
          />
      <Route
            path="/admin/category-management/edit/:categoryId"
            element={<AdminEditCategoryPage />}
          />
      <Route path="/admin/profile" element={<AdminProfilePage />} />
      <Route
            path="/admin/notification"
            element={<AdminNotificationPage />}
          />
      <Route
            path="/admin/reset-password"
            element={<AdminResetPasswordPage />}
          />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
