'use client';

import * as React from 'react';

// import type { User } from '@/types/user';
import { authClient } from '@/lib/auth/client';
import { logger } from '@/lib/default-logger';
import { initializeMsal, msalInstance } from "@/app/msal/msal";
import { MsalProvider } from "@azure/msal-react";
import { type AccountInfo } from "@azure/msal-browser";
import type { EduquestUserCosmeticResult, EduquestUser} from "@/types/eduquest-user";

export interface UserContextValue {
  user: AccountInfo | null;
  eduquestUser: EduquestUser | null;
  error: string | null;
  isLoading: boolean;
  cosmetic: EduquestUserCosmeticResult | null;
  checkSession?: () => Promise<void>;
}

export const UserContext = React.createContext<UserContextValue | undefined>(undefined);

export interface UserProviderProps {
  children: React.ReactNode;
}

export function UserProvider({ children }: UserProviderProps): React.JSX.Element {

  const [state, setState] = React.useState<{
    user: AccountInfo | null;
    eduquestUser: EduquestUser | null;
    cosmetic: EduquestUserCosmeticResult | null;
    error: string | null;
    isLoading: boolean
  }>({
      user: null,
      eduquestUser: null,
      cosmetic: null,
      error: null,
      isLoading: true,
  });

  const sessionPromiseRef = React.useRef<Promise<void> | null>(null);

  const checkSession = React.useCallback(async (): Promise<void> => {
    if (sessionPromiseRef.current) {
      await sessionPromiseRef.current;
      return;
    }

    const runSessionCheck = async (): Promise<void> => {
      try {
        await initializeMsal();

        const { data, error } = await authClient.getUser();

        if (error) {
          logger.error("authClient error: ", error);
          setState((prev) => ({
              ...prev,
              user: null,
              eduquestUser: null,
              cosmetic: null,
              error,
              isLoading: false
            }));
          return;
        }

        setState((prev) => ({
          ...prev,
          user: data.user ?? null,
          eduquestUser: data.eduquestUser ?? null,
          cosmetic: data.cosmetic ?? null,
          error: null,
          isLoading: false
        }));

      }
      catch (err) {
        logger.error(err);
        setState((prev) => ({
          ...prev,
          user: null,
          eduquestUser: null,
          cosmetic: null,
          error: 'Something went wrong',
          isLoading: false
        }));
      }
    };

    sessionPromiseRef.current = runSessionCheck();

    try {
      await sessionPromiseRef.current;
    } finally {
      sessionPromiseRef.current = null;
    }
  }, []);

  React.useEffect(() => {
    void checkSession();
  }, [checkSession]);

  return (
    <MsalProvider instance={msalInstance}>
      <UserContext.Provider value={{ ...state, checkSession }}>

        {children}

      </UserContext.Provider>
    </MsalProvider>
      );
}

export const UserConsumer = UserContext.Consumer;
