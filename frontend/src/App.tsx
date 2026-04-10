import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import InventoryPage from "./pages/InventoryPage";
import DonorsPage from "./pages/DonorsPage";
import RequestsPage from "./pages/RequestsPage";
import ForecastingPage from "./pages/ForecastingPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import NotificationsPage from "./pages/NotificationsPage";
import SettingsPage from "./pages/SettingsPage";
import DonorRegistrationPage from "./pages/DonorRegistrationPage";
import CreateRequestPage from "./pages/CreateRequestPage";

const queryClient = new QueryClient();

/* -------- ROLE BASED REDIRECT -------- */

const RoleRedirect = () => {

  const role = localStorage.getItem("role");

  if (role === "ADMIN") return <Navigate to="/dashboard" replace />;
  if (role === "DONOR") return <Navigate to="/donors/register" replace />;
  if (role === "HOSPITAL") return <Navigate to="/requests/create" replace />;

  return <Navigate to="/auth" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <AuthProvider>

          <Routes>

            {/* PUBLIC */}
            <Route path="/auth" element={<AuthPage />} />

            {/* ROOT REDIRECT */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <RoleRedirect />
                </ProtectedRoute>
              }
            />

            {/* ADMIN DASHBOARD */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <Index />
                </ProtectedRoute>
              }
            />

            {/* INVENTORY (ADMIN + DONOR) */}
            <Route
              path="/inventory"
              element={
                <ProtectedRoute allowedRoles={["ADMIN", "DONOR"]}>
                  <InventoryPage />
                </ProtectedRoute>
              }
            />

            {/* DONOR MANAGEMENT (ADMIN) */}
            <Route
              path="/donors"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <DonorsPage />
                </ProtectedRoute>
              }
            />

            {/* DONOR REGISTER (DONOR) */}
            <Route
              path="/donors/register"
              element={
                <ProtectedRoute allowedRoles={["DONOR"]}>
                  <DonorRegistrationPage />
                </ProtectedRoute>
              }
            />

            {/* REQUESTS VIEW (ADMIN + HOSPITAL) */}
            <Route
              path="/requests"
              element={
                <ProtectedRoute allowedRoles={["ADMIN", "HOSPITAL"]}>
                  <RequestsPage />
                </ProtectedRoute>
              }
            />

            {/* CREATE REQUEST (HOSPITAL) */}
            <Route
              path="/requests/create"
              element={
                <ProtectedRoute allowedRoles={["HOSPITAL"]}>
                  <CreateRequestPage />
                </ProtectedRoute>
              }
            />

            {/* AI FORECASTING (ADMIN) */}
            <Route
              path="/forecasting"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <ForecastingPage />
                </ProtectedRoute>
              }
            />

            {/* ANALYTICS (ADMIN) */}
            <Route
              path="/analytics"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AnalyticsPage />
                </ProtectedRoute>
              }
            />

            {/* NOTIFICATIONS (ADMIN) */}
            <Route
              path="/notifications"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <NotificationsPage />
                </ProtectedRoute>
              }
            />

            {/* SETTINGS (ALL USERS) */}
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />

          </Routes>

        </AuthProvider>
      </BrowserRouter>

    </TooltipProvider>
  </QueryClientProvider>
);

export default App;