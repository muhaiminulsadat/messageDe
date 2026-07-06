import React from "react";
import {Navigate} from "react-router";
import {Spinner} from "@heroui/react";
import {authClient} from "../lib/auth-client";

interface AuthRouteProps {
  children: React.ReactNode;
}

export const AuthRoute = ({children}: AuthRouteProps) => {
  const {data: session, isPending} = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-2">
        <Spinner size="lg" />
        <span className="text-sm text-default-500">Loading session...</span>
      </div>
    );
  }

  if (session) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AuthRoute;
