import {ThemeProvider} from "./context/ThemeContext";
import {WallpaperProvider} from "./context/WallpaperContext";
import {Route, Routes} from "react-router";
import ChatPage from "./pages/ChatPage";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRoute from "./components/AuthRoute";

const App = () => {
  return (
    <ThemeProvider>
      <WallpaperProvider>
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
