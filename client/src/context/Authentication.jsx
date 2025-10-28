import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = React.createContext();

function AuthProvider(props) {
  const [state, setState] = useState({
    loading: null,
    getUserLoading: null,
    error: null,
    user: null,
  });

  const navigate = useNavigate();

  // ดึงข้อมูลผู้ใช้โดยใช้ Supabase API
  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setState((prevState) => ({
        ...prevState,
        user: null,
        getUserLoading: false,
      }));
      return;
    }

    try {
      setState((prevState) => ({ ...prevState, getUserLoading: true }));
      const response = await axios.get(
        "/api/auth/get-user",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const apiUser = response.data || {};
      // normalize profile picture field
      const normalizedUser = {
        ...apiUser,
        profilePic: apiUser.profilePic || apiUser.profile_pic || null,
      };
      // persist author avatar for public cards if admin
      if (normalizedUser.role === 'admin' && normalizedUser.profilePic) {
        try { localStorage.setItem('author_profile_pic', normalizedUser.profilePic); } catch {}
      }
      setState((prevState) => ({
        ...prevState,
        user: normalizedUser,
        getUserLoading: false,
      }));
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        error: error.message,
        user: null,
        getUserLoading: false,
      }));
    }
  };

  useEffect(() => {
    fetchUser(); // โหลดข้อมูลผู้ใช้เมื่อแอปเริ่มต้น
  }, []);

  // ล็อกอินผู้ใช้
  const login = async (data) => {
    try {
      setState((prevState) => ({ ...prevState, loading: true, error: null }));
      const response = await axios.post(
        "/api/auth/login",
        data
      );
      const token = response.data.token;
      localStorage.setItem("token", token);

      // ดึงและตั้งค่าข้อมูลผู้ใช้ก่อน navigate
      const userResponse = await axios.get(
        "/api/auth/get-user",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const apiUser = userResponse.data || {};
      const normalizedUser = {
        ...apiUser,
        profilePic: apiUser.profilePic || apiUser.profile_pic || null,
      };
      if (normalizedUser.role === 'admin' && normalizedUser.profilePic) {
        try { localStorage.setItem('author_profile_pic', normalizedUser.profilePic); } catch {}
      }
      // Set user state และ loading state ก่อน navigate
      setState({
        loading: false,
        getUserLoading: false,
        error: null,
        user: normalizedUser
      });
      
      navigate("/");
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: error.response?.data?.error || "Login failed",
      }));
      return { error: error.response?.data?.error || "Login failed" };
    }
  };

  // ลงทะเบียนผู้ใช้
  const register = async (data) => {
    try {
      setState((prevState) => ({ ...prevState, loading: true, error: null }));
      await axios.post(
        "/api/auth/register",
        data
      );
      setState((prevState) => ({ ...prevState, loading: false, error: null }));
      navigate("/sign-up/success");
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: error.response?.data?.error || "Registration failed",
      }));
      return { error: error.response?.data?.error || "Registration failed" };
    }
  };

  // ล็อกเอาท์ผู้ใช้
  const logout = () => {
    localStorage.removeItem("token");
    setState({ user: null, error: null, loading: null });
    navigate("/");
  };

  const isAuthenticated = Boolean(state.user);

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        logout,
        register,
        isAuthenticated,
        fetchUser,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };

