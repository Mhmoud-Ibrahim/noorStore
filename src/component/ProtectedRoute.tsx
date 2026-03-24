import { Navigate, Outlet } from "react-router-dom";

import { useContext } from "react";
import { MainContext, type mainContextType } from "./mainContext.tsx";
import Loading from "./Loading.tsx";

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const Context = useContext(MainContext);
  if (!Context) return null;

  const { user, loading } = Context as mainContextType;
  if (loading) {
    return <Loading />;
  }
  if (!user) {
    console.log("Access Denied: No User Found");
    return <Navigate to="/login" replace />;
  }
  return children ? <>{children}</> : <Outlet />;
}
