// msal.ts

import { type AuthenticationResult, InteractionRequiredAuthError, PublicClientApplication } from "@azure/msal-browser";
import { msalConfig, userDataLoginRequest, graphLoginRequest } from "./msal-config";
import { logger } from '@/lib/default-logger';

export const msalInstance = new PublicClientApplication(msalConfig);
let msalInitializationPromise: Promise<void> | null = null;

/**
 * Initializes MSAL by handling redirect responses and setting the active account.
 */
export async function initializeMsal(): Promise<void> {
  if (msalInitializationPromise) {
    await msalInitializationPromise;
    return;
  }

  msalInitializationPromise = (async (): Promise<void> => {
    logger.debug("MSAL: Initializing...");
    await msalInstance.initialize();
    try {
      // Handle redirect promise to process the response from loginRedirect
      const loginResponse: AuthenticationResult | null = await msalInstance.handleRedirectPromise();

    if (loginResponse && loginResponse.account !== null) {
      logger.debug("MSAL: Login response received");
      msalInstance.setActiveAccount(loginResponse.account);
      // await handleLoginResponse(loginResponse);
    } else {
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        msalInstance.setActiveAccount(accounts[0]);
        logger.debug("MSAL: Active account set");
      }
    }

      logger.debug("MSAL: Initialization complete.");
    } catch (error) {
      logger.error("MSAL: Initialization error:", error);
    }
  })();

  try {
    await msalInitializationPromise;
  } finally {
    msalInitializationPromise = null;
  }
}

/**
 * Acquires a token silently, or triggers a login if necessary.
 */
export async function getToken(): Promise<string | null> {
  try {
    const activeAccount = msalInstance.getActiveAccount();
    if (!activeAccount) {
      logger.warn("MSAL: No active account found; skipping token acquisition until the user actually signs in.");
      return null;
    }

    const response = await msalInstance.acquireTokenSilent({
      ...userDataLoginRequest,
      account: activeAccount,
    });
    logger.debug("MSAL: Token acquired silently.");
    return response.accessToken;
  } catch (error) {
    if (error instanceof InteractionRequiredAuthError) {
      logger.warn('MSAL: Interaction required; leaving the app in its current auth state instead of forcing a redirect from every request.');
    } else {
      logger.error('MSAL: Unexpected error acquiring token silently:', error);
    }
    return null;
  }
}

/**
 * Handles the login redirect process.
 */
export async function handleLoginRedirect(): Promise<void> {
  try {
    await msalInstance.loginRedirect(userDataLoginRequest);
    logger.debug("MSAL: Redirecting to login...");
  } catch (error) {
    logger.error("MSAL: Error during login redirect:", error);
  }
}

export async function handleAcquireTokenRedirect(): Promise<void> {
  try {
    await msalInstance.acquireTokenRedirect(graphLoginRequest);
    logger.debug("MSAL: Redirecting to acquire token...");
  } catch (error) {
    logger.error("MSAL: Error during token acquisition redirect:", error);
  }
}

/**
 * Handles the logout process.
 */
export const handleLogout = (logoutType = "redirect"): void => {
  if (logoutType === "popup") {
    msalInstance.logoutPopup().catch((e: unknown) => {
      logger.error("MSAL: logoutPopup failed:", e);
    });
  } else if (logoutType === "redirect") {
    const logoutRequest = {
      account: msalInstance.getActiveAccount(),
      postLogoutRedirectUri: "/auth/sign-in",
    };
    msalInstance.logoutRedirect(logoutRequest).catch((e: unknown) => {
      logger.error("MSAL: logoutRedirect failed:", e);
    });
  }
};
