'use client';

import axios, { type AxiosResponse } from 'axios';
import { handleLoginRedirect, handleLogout, getToken, msalInstance } from "@/app/msal/msal";
import { logger } from '@/lib/default-logger';
import type { EduquestUser, EduquestUserCosmeticResult } from "@/types/eduquest-user";
import { type AccountInfo } from "@azure/msal-browser";
import { graphLoginRequest } from "@/app/msal/msal-config";
import type { Image } from '@/types/image';
import { CosmeticType, type Cosmetic } from '@/types/cosmetic';

const DEMO_AUTH_STORAGE_KEY = 'eduquest-demo-auth';

interface DemoAuth {
  access: string;
  refresh: string;
  user: EduquestUser;
}

function getStoredDemoAuth(): DemoAuth | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.localStorage.getItem(DEMO_AUTH_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as DemoAuth;
  } catch {
    window.localStorage.removeItem(DEMO_AUTH_STORAGE_KEY);
    return null;
  }
}

function setStoredDemoAuth(auth: DemoAuth): void {
  window.localStorage.setItem(DEMO_AUTH_STORAGE_KEY, JSON.stringify(auth));
}

function clearStoredDemoAuth(): void {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(DEMO_AUTH_STORAGE_KEY);
  }
}

export function getDemoAccessToken(): string | null {
  return getStoredDemoAuth()?.access ?? null;
}

/**
 * Create a separate Axios instance for AuthClient to avoid circular dependencies.
 */
const authApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

/**
 * Set up the request interceptor to use MSAL's getToken method.
 */
authApi.interceptors.request.use(
  async (config) => {
    const token = getDemoAccessToken() ?? await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      logger.warn('MSAL: No access token available for Auth API request.');
    }
    return config;
  },
  (error) => {
    logger.error('Failed to set access-token for Auth API request.', error);
    return Promise.reject(new Error('Failed to set access-token for Auth API request.'));
  }
);

class AuthClient {
  /**
   * Initiates the sign-in process using MSAL.
   */
  async signInWithMsal(): Promise<{ error?: string }> {
    try {
      clearStoredDemoAuth();
      msalInstance.setActiveAccount(null);
      await handleLoginRedirect();
      return {};
    } catch (error) {
      const err = error as Error;
      logger.error('Error signing in', err);
      return { error: err.message };
    }
  }

  async signInAsDemo(email: string, password: string): Promise<{ error?: string }> {
    try {
      const response: AxiosResponse<DemoAuth> = await axios.post<DemoAuth>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL ?? ''}/api/auth/demo-login/`,
        { email, password }
      );
      setStoredDemoAuth(response.data);
      msalInstance.setActiveAccount(null);
      return {};
    } catch (error) {
      const err = error as Error & { response?: { data?: { detail?: string } } };
      logger.error('Error signing in demo user', err);
      return { error: err.response?.data?.detail ?? err.message };
    }
  }

  /**
   * Retrieves the authenticated user and their EduquestUser profile.
   */
  async getUser(): Promise<{
    data: {
      user: AccountInfo | null;
      eduquestUser: EduquestUser | null;
      cosmetic: EduquestUserCosmeticResult | null;
    }
    error?: string
  }> {
    const demoAuth = getStoredDemoAuth();
    if (demoAuth) {
      const emptyImage: Image = {
        id: -1,
        name: "",
        filename: ""
      }
      const emptyCosmetic: Cosmetic = {
        id: -1,
        name: '',
        type: CosmeticType.Picture,
        image: emptyImage,
        cost: 0
      }
      const demoCosmetic: EduquestUserCosmeticResult = {
          profile_picture: emptyCosmetic,
          profile_background: "",
          profile_border: emptyCosmetic,
          banner: emptyCosmetic,
          displayed_badges: [],
          about_me: "",
          owns: []
      }
      return {
        data: {
          user: {
            homeAccountId: `demo-${String(demoAuth.user.id)}`,
            environment: 'demo',
            tenantId: 'demo',
            username: demoAuth.user.email,
            localAccountId: String(demoAuth.user.id),
            name: demoAuth.user.nickname,
          } as AccountInfo,
          eduquestUser: demoAuth.user,
          cosmetic: demoCosmetic
        }
      };
    }

    const msalUser = msalInstance.getActiveAccount();
    if (!msalUser) {
      logger.warn('MSAL: No active user found');
      return {
        data: {
          user: null,
          eduquestUser: null,
          cosmetic: null
        }
      };
    }

    // Check if the email domain is allowed
    if (
      msalUser.username &&
      !msalUser.username.includes('@e.ntu.edu.sg') &&
      !msalUser.username.includes('@ntu.edu.sg') &&
      !msalUser.username.includes('@staff.main.ntu.edu.sg')
    ) {
      logger.debug('User is not from NTU, redirecting to login.');
      return {
        data: {
          user: null,
          eduquestUser: null,
          cosmetic: null
        },
        error: 'Please sign in with your NTU email account.'
      };
    }

    // Get the EduquestUser profile
    const eduquestUser = await this.getEduquestUser(msalUser.username);

    if (eduquestUser === null) {
      return {
        data: {
          user: null,
          eduquestUser: null,
          cosmetic: null
        },
        error: 'Failed to fetch user profile.'
      };
    }

    const cosmetic = await this.getEduquestUserCosmetic(msalUser.username);

    // Return the user and eduquest user
    return { data: { user: msalUser, eduquestUser, cosmetic } };
  }

  /* 
   * DEPRECATED. Replaced with software specific cosmetics
   * Acquires an access token for Microsoft Graph and fetches the user's photo.
   * async getUserPhotoAvatar(): Promise<string> {
   * try {
   *  const accessToken = await this.getAccessTokenForGraph();
   *
   *   if (accessToken) {
   *     const photoEndpoint = `${graphConfig.graphMeEndpoint}/photo/$value`;
   *
   *     const response = await fetch(photoEndpoint, {
   *       method: "GET",
   *        headers: {
   *         "Authorization": `Bearer ${accessToken}`,
   *       },
   *     });
   *     // If successful, this method returns a 200 OK response code and binary data of the requested photo.
   *     // If no photo exists, the operation returns 404 Not Found.
   *
   *     if (response.status === 200) {
   *       const blob = await response.blob();
   *       return URL.createObjectURL(blob);
   *     }
   *     logger.error(`Failed to fetch blob from graph API: ${response.statusText}`);
   *     return ''; // Return a fallback avatar URL or an empty string
   *   }
   *   logger.error('Failed to fetch access token for user photo.');
   *   return ''; // Return a fallback avatar URL or an empty string
   * } catch (error) {
   *   logger.error('Failed to fetch user photo:', error);
   *   return ''; // Return a fallback avatar URL or an empty string
   * }
   * }
   */

  /**
   * Acquires an access token specifically for Microsoft Graph API.
   */
  async getAccessTokenForGraph(): Promise<string | null> {
    const activeAccount = msalInstance.getActiveAccount();
    if (!activeAccount) {
      logger.warn("MSAL: No active account found, initiating login.");
      await this.signInWithMsal();
      return null;
    }

    try {
      const response = await msalInstance.acquireTokenSilent({
        ...graphLoginRequest,
        account: activeAccount,
      });
      logger.debug("MSAL: Graph API token acquired silently.");
      return response.accessToken;
    } catch (error) {
      logger.error('MSAL: Error acquiring Graph API token silently:', error);
      return null;
    }
  }

  /**
   * Fetches the EduquestUser profile based on the username.
   */
  async getEduquestUser(username: string): Promise<EduquestUser | null> {
    try {
      const response: AxiosResponse<EduquestUser> = await authApi.get<EduquestUser>(
        `/api/eduquest-users/by_email/?email=${encodeURIComponent(username.toUpperCase())}`
      );
      return response.data;
    } catch (error: unknown) {
      logger.error('Failed to fetch Eduquest User, redirecting to Login page:', error);
      return null;
    }
  }

  /** 
   * Fetches the EduquestUser cosmetic based on the username.
   */
  async getEduquestUserCosmetic(username: string): Promise<EduquestUserCosmeticResult | null> {
    try {
      const response: AxiosResponse<EduquestUserCosmeticResult> = await authApi.get<EduquestUserCosmeticResult>(
        `/api/eduquest-users/cosmetic_details/?email=${encodeURIComponent(username.toUpperCase())}`
      );
      return response.data;
    } catch (error: unknown) {
      logger.error('Failed to fetch Eduquest User Cosmetic', error);
      return null;
    }
  }

  /**
   * Initiates the sign-out process using MSAL.
   */
  async signOutMsal(): Promise<{ error?: string }> {
    try {
      clearStoredDemoAuth();
      if (!msalInstance.getActiveAccount()) {
        return {};
      }
      handleLogout('redirect');
      return {};
    } catch (error) {
      const err = error as Error;
      logger.error('Error signing out', err);
      return { error: err.message };
    }
  }
}

export const authClient = new AuthClient();
