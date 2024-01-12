import { ReactNode } from "react";
import { useLoginState } from "./useLoginState";
import { LoginStateProvider } from "./LoginStateProvider";
import { LoginPage } from "./LoginPage";
import { Box, Card, CardHeader, CardBody } from "grommet";

export interface LoginGuardProps {
  children: ReactNode;
}

export function LoginGuard({ children }: LoginGuardProps) {
  const state = useLoginState();
  const { isLoggedIn } = state;

  return (
    <LoginStateProvider state={state}>
      {!isLoggedIn && <LoginPage />}
      {isLoggedIn && (
        <Box pad="medium" width="wide">
          <Card pad="small" gap="small">
            {
              /*The CardHeader component is not part of the mockup but keeping it as its
              part of the original code.*/
            }
            <CardHeader background="accent-3">
              <strong>You are Logged In!</strong>
            </CardHeader>
            <CardBody>
              { children }
            </CardBody>
          </Card>
        </Box>
      )}
    </LoginStateProvider>
  );
}
