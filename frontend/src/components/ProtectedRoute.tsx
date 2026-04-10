import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ children, allowedRoles }: Props) => {

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  /* -------- NOT LOGGED IN -------- */

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  /* -------- ROLE RESTRICTION -------- */

  if (allowedRoles && role && !allowedRoles.includes(role)) {

    // Redirect user to their correct page

    switch (role) {

      case "ADMIN":
        return <Navigate to="/dashboard" replace />;

      case "DONOR":
        return <Navigate to="/donor-registration" replace />;

      case "HOSPITAL":
        return <Navigate to="/create-request" replace />;

      default:
        return <Navigate to="/auth" replace />;
    }
  }

  return <>{children}</>;
};