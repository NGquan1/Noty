import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ProjectSettingsPage from "./pages/ProjectSettingsPage";
import ProfilePage from "./pages/ProfilePage";
import NotePage from "./pages/NotePage";
import JoinProjectPage from "./pages/JoinProjectPage"; // ✅ Thêm dòng này

import { Loader } from "lucide-react";
import { useAuthStore } from "./store/useAuthStore";
import Navbar from "./components/Navbar";
import { useThemeStore } from "./store/useThemeStore";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  const hideNavbar = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div data-theme={theme}>
      {!hideNavbar && <Navbar />}
      <Toaster position="top-center" />

      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/tasks"
          element={authUser ? <NotePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/settings"
          element={
            authUser ? <ProjectSettingsPage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/notes"
          element={authUser ? <NotePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/join/:token"
          element={authUser ? <JoinProjectPage /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
};

export default App;
