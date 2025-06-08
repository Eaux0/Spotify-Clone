// MainPage.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import UserHomePage from "./pages/UserHomePage";
import AnonHomePage from "./pages/AnonHomePage";
import LoginPage from "./pages/LoginPage";
import "./index.css";

interface JwtPayload {
  username: string;
  name: string;
  role: string;
}

const MainPage = () => {
  const [jwt, setJwt] = useState<JwtPayload | null>(null);

  const handleLogin = (token: JwtPayload) => setJwt(token);
  const handleLogout = () => setJwt(null);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={jwt ? "/user" : "/anon"} replace />}
        />
        <Route
          path="/login"
          element={<LoginPage onLoginSuccess={handleLogin} />}
        />
        <Route path="/anon" element={<AnonHomePage />} />
        <Route
          path="/user"
          element={
            jwt ? (
              <UserHomePage jwt={jwt} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default MainPage;
