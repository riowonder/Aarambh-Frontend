import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ForgotPswdOTP from './pages/auth/ForgotPswdOTP';
import Dashboard from './pages/main/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import OTP from './pages/auth/OTP';
import { UserProvider } from './context/UserContext';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css'
import { Toaster } from 'react-hot-toast';
import AllMembers from './pages/main/AllMembers';
import Finance from './pages/main/Finance';
import AdminRoute from './components/AdminRoute';
import ManagerRoute from './components/ManagerRoute';
import AdminLayout from './layouts/AdminLayout';
import ManagerLayout from './layouts/ManagerLayout';
import ErrorPage from './components/ErrorPage';
import UserRegister from './pages/auth/UserRegister';
import Register from './pages/auth/Register';
import UserForgotPassword from './pages/auth/UserForgotPassword';
import UserForgotPswdOTP from './pages/auth/UserForgotPswdOTP';
import UserResetPswd from './pages/auth/UserResetPswd';
import ResetPswd from './pages/auth/ResetPswd';
import Birthday from './pages/main/Birthday';
import UserLayout from './layouts/UserLayout';
import UserRoute from './components/UserRoute';
import UserDashboard from './pages/main/UserDashboard';
import UserSubscriptions from './pages/main/UserSubscriptions';
import ApprovalRequests from './pages/main/ApprovalRequests';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from "./pages/main/Home";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
      <UserProvider>
        <BrowserRouter>
        <Toaster />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Dashpanel" element={<Login />} />
            <Route path="/dashpanelsignup" element={<Signup />} />
            <Route path="/user-login" element={<Home openLoginOnLoad />} />
            <Route path="/user-register" element={<Register />} />
            <Route path="/user-forgot-password" element={<UserForgotPassword />} />
            <Route path="/user-forgot-password/otp-verification" element={<UserForgotPswdOTP />} />
            <Route path="/user-reset-password" element={<UserResetPswd />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/otp-verification" element={<OTP />} />
            <Route path="/forgot-password/otp-verification" element={<ForgotPswdOTP />} />
            <Route path="/reset-password" element={<ResetPswd />} />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
              errorElement={<ErrorPage />}
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="members" element={<AllMembers />} />
              <Route path="finance" element={<Finance />} />
              <Route path="birthdays" element={<Birthday />} />
              <Route path="approval-requests" element={<ApprovalRequests />} />
            </Route>
            {/* <Route
              path="/manager"
              element={
                <ManagerRoute>
                  <ManagerLayout />
                </ManagerRoute>
              }
              errorElement={<ErrorPage />}
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="members" element={<AllMembers />} />
            </Route> */}
            <Route
              path="/user"
              element={
                <UserRoute>
                  <UserLayout />
                </UserRoute>
              }
              errorElement={<ErrorPage />}
            >
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="subscriptions" element={<UserSubscriptions />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
