import React, { useState } from "react";
import "../styles/LoginPage.css"; // Ensure the CSS is imported
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface LoginPageProps {
  onLoginSuccess: (jwt: {
    username: string;
    name: string;
    role: string;
  }) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignIn = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8081/api/auth/login",
        {
          username: formData.username,
          password: formData.password,
        }
      );

      const jwt = response.data; // assuming it returns { username, name, role }
      onLoginSuccess(jwt);
      navigate("/user");
    } catch (error: any) {
      if (error.response?.data?.message === "Bad credentials") {
        alert("Invalid username or password.");
      } else {
        alert("Login failed. Please try again.");
      }
    }
  };

  const handleCreateAccount = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await axios.post("http://localhost:8081/api/users/createUser", {
        username: formData.username,
        password: formData.password,
        name: formData.name,
        role: "ROLE_USER", // hardcoded as per requirement
      });

      // Now login after successful registration
      await handleSignIn();
    } catch (error: any) {
      alert("Account creation failed. Username may already exist.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>{isCreatingAccount ? "Create Account" : "Sign In"}</h2>

        {isCreatingAccount && (
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            className="login-input"
          />
        )}

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleInputChange}
          className="login-input"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          className="login-input"
        />

        {isCreatingAccount && (
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="login-input"
          />
        )}

        {isCreatingAccount ? (
          <button className="login-btn" onClick={handleCreateAccount}>
            Create Account
          </button>
        ) : (
          <button className="login-btn" onClick={handleSignIn}>
            Sign In
          </button>
        )}

        <div className="login-toggle">
          {isCreatingAccount ? (
            <span>
              Already have an account?{" "}
              <button onClick={() => setIsCreatingAccount(false)}>
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Don't have an account?{" "}
              <button onClick={() => setIsCreatingAccount(true)}>
                Create Account
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
