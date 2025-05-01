import React, { createContext, useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { apiService } from '../utils/api';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backendAwake, setBackendAwake] = useState(true);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const response = await apiService.auth.getCurrentUser();
      setUser(response.data.user);
      setBackendAwake(true);
    } catch (error) {
      console.error("Error fetching user data:", error);
      
      if (error.code === 'ECONNABORTED' || !error.response) {
        setBackendAwake(false);
        toast.info("Connecting to server. This may take a moment if the server was inactive.");
      } else if (error.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("token");
        toast.error("Session expired. Please login again.");
      }
      
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, loading, backendAwake, setUser, fetchUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
