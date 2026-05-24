import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CategoriesPage from "./pages/CategoriesPage";
import SpeakersPage from "./pages/SpeakersPage";
import EventsPage from "./pages/EventsPage";
import BiodataPage from "./pages/BiodataPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "14px",
            borderRadius: "12px",
            boxShadow:
              "0 4px 24px -4px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06)",
          },
          success: {
            iconTheme: {
              primary: "#4f63ff",
              secondary: "#ffffff",
            },
          },
        }}
      />

      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <CategoriesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/speakers"
          element={
            <ProtectedRoute>
              <SpeakersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <EventsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/biodata"
          element={
            <ProtectedRoute>
              <BiodataPage />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
