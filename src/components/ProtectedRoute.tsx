import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import LogoLoader from "./LogoLoader";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, loading } = useAuth();

  if (loading) {
    return <LogoLoader />;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
