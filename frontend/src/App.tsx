import {ThemeProvider} from "./context/ThemeContext";
import {WallpaperProvider} from "./context/WallpaperContext";
import {Route, Routes} from "react-router";
import {Toaster} from "react-hot-toast";
import ChatPage from "./pages/ChatPage";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRoute from "./components/AuthRoute";
import {useAuthStore} from "./store/useAuthStore";
import {useEffect} from "react";

const App = () => {
  const {checkAuth, isCheckingAuth} = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <p>Loading...</p>
      </div>
    );
  } 
  return (
    <ThemeProvider>
      <WallpaperProvider>
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/auth"
            element={
              <AuthRoute>
                <AuthPage />
              </AuthRoute>
            }
          />
        </Routes>
      </WallpaperProvider>
    </ThemeProvider>
  );
};

export default App;
