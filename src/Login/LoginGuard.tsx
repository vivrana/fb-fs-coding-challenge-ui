import { ReactNode } from "react";
import { useLoginState } from "./useLoginState";
import { LoginStateProvider } from "./LoginStateProvider";
import { LoginPage } from "./LoginPage";

export interface LoginGuardProps {
  children: ReactNode;
}

export function LoginGuard({ children }: LoginGuardProps) {
  const state = useLoginState();

  return (
    <LoginStateProvider state={state}>
      {state.isLoggedIn ? children : <LoginPage />}
    </LoginStateProvider>
  );
}
