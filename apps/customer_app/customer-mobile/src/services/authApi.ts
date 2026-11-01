import AsyncStorage from '@react-native-async-storage/async-storage';

import { API_URL } from './apiConfig';

export type Customer = {
  id: string;
  email: string | null;
  phone: string | null;
  fullName: string;
};

type CustomerSession = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number | null;
};

type AuthResult = {
  user: Customer;
  session: CustomerSession;
};

type SignUpResult = {
  user: Customer;
  session: CustomerSession | null;
  requiresEmailConfirmation: boolean;
};

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

const SESSION_KEY =
  'signatures.customer.auth-session';

let currentSession: CustomerSession | null = null;
let refreshPromise: Promise<AuthResult> | null = null;

async function readResponse<T>(
  response: Response,
): Promise<T> {
  const data = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !data.success) {
    throw new Error(
      data.message ?? 'Authentication request failed',
    );
  }

  return data.data;
}

async function saveSession(
  session: CustomerSession | null,
) {
  currentSession = session;

  if (session) {
    await AsyncStorage.setItem(
      SESSION_KEY,
      JSON.stringify(session),
    );
  } else {
    await AsyncStorage.removeItem(SESSION_KEY);
  }
}

async function loadStoredSession() {
  if (currentSession) {
    return currentSession;
  }

  const stored = await AsyncStorage.getItem(
    SESSION_KEY,
  );

  if (!stored) {
    return null;
  }

  currentSession = JSON.parse(
    stored,
  ) as CustomerSession;

  return currentSession;
}

async function refreshAuthSession() {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const session = await loadStoredSession();

    if (!session) {
      throw new Error('No saved session');
    }

    const response = await fetch(
      `${API_URL}/auth/refresh`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: session.refreshToken,
        }),
      },
    );

    const result = await readResponse<AuthResult>(
      response,
    );
    await saveSession(result.session);

    return result;
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

export async function signUp(input: {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
}) {
  const response = await fetch(
    `${API_URL}/auth/sign-up`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    },
  );

  const result = await readResponse<SignUpResult>(
    response,
  );

  if (result.session) {
    await saveSession(result.session);
  }

  return result;
}

export async function signIn(
  email: string,
  password: string,
) {
  const response = await fetch(
    `${API_URL}/auth/sign-in`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    },
  );

  const result = await readResponse<AuthResult>(
    response,
  );
  await saveSession(result.session);

  return result;
}

export async function restoreSession() {
  const session = await loadStoredSession();

  if (!session) {
    return null;
  }

  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  if (response.ok) {
    return readResponse<Customer>(response);
  }

  try {
    const refreshed = await refreshAuthSession();
    return refreshed.user;
  } catch (error) {
    await saveSession(null);
    throw error;
  }
}

export async function authenticatedFetch(
  input: string,
  init: RequestInit = {},
) {
  let session = await loadStoredSession();

  if (!session) {
    throw new Error('Please sign in to continue');
  }

  const send = (accessToken: string) =>
    fetch(input, {
      ...init,
      headers: {
        ...init.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });

  let response = await send(session.accessToken);

  if (response.status === 401) {
    const refreshed = await refreshAuthSession();
    session = refreshed.session;
    response = await send(session.accessToken);
  }

  return response;
}

export async function signOut() {
  const session = await loadStoredSession();

  try {
    if (session) {
      await fetch(`${API_URL}/auth/sign-out`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });
    }
  } finally {
    await saveSession(null);
  }
}
