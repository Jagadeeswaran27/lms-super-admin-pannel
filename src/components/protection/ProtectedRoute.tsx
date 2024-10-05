import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { AuthContext } from "../../store/AuthContext";
import { ThemeColors } from "../../resources/colors";

interface ProtectedRouteProps {
  element: React.ReactElement;
}

export default function ProtectedRoute({ element }: ProtectedRouteProps) {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress
          sx={{
            color: ThemeColors.authPrimary,
            size: 50,
            animationDuration: "1s",
            animationTimingFunction: "ease-in-out",
          }}
        />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return element;
}
