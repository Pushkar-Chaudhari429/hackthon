import { useEffect, useState } from "react";
import DashboardPage from "./pages/DashboardPage";
import LandingPage from "./pages/LandingPage";

function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const goTo = (targetPath) => {
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, "", targetPath);
      setPath(targetPath);
    }
  };

  if (path === "/dashboard") {
    return <DashboardPage />;
  }

  return <LandingPage onEnterDashboard={() => goTo("/dashboard")} />;
}

export default App;
