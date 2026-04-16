import { useState } from "react";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");

  const handleLogin = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  return token ? (
      <DashboardPage onLogout={handleLogout} />
  ) : (
      <AuthPage onLogin={handleLogin} />
  );
}

export default App;