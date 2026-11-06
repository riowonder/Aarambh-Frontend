import axios from "axios";
import { Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Spinner from "../components/Spinner";

const useAuthentication = () => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/is-authenticated`, { withCredentials: true });
        setAuth(response.data.success);
      } catch {
        setAuth(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return { auth: false, loading: true };
  }

  return { auth, loading: false };
};

const ProtectedRoute = ({ children }) => {
  const { auth, loading } = useAuthentication();
  if (loading) return <Spinner />;
  if (!auth) {
    return <Navigate to="/dashboardpanel" replace />;
  }
  return children;
};

export default ProtectedRoute;
