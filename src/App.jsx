import { useState } from "react";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import Footer from "./components/Footer";

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

    return (
        <div className="app-shell">
            <main className="app-main">
                {token ? (
                    <DashboardPage onLogout={handleLogout} />
                ) : (
                    <AuthPage onLogin={handleLogin} />
                )}
            </main>

            <Footer />
        </div>
    );
}

export default App;