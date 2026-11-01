import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import {
  restoreSession,
  signIn as signInApi,
  signOut as signOutApi,
  signUp as signUpApi,
  type Customer,
} from '../services/authApi';

type SignUpInput = {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
};

type AuthContextValue = {
  customer: Customer | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<void>;
  signUp: (
    input: SignUpInput,
  ) => Promise<{ requiresEmailConfirmation: boolean }>;
  signOut: () => Promise<void>;
};

const AuthContext =
  createContext<AuthContextValue | undefined>(
    undefined,
  );

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [customer, setCustomer] =
    useState<Customer | null>(null);
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      try {
        const restoredCustomer = await restoreSession();

        if (!cancelled) {
          setCustomer(restoredCustomer);
        }
      } catch (error) {
        console.error(
          'Failed to restore customer session:',
          error,
        );

        if (!cancelled) {
          setCustomer(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = async (
    email: string,
    password: string,
  ) => {
    const result = await signInApi(email, password);
    setCustomer(result.user);
  };

  const signUp = async (input: SignUpInput) => {
    const result = await signUpApi(input);

    if (result.session) {
      setCustomer(result.user);
    }

    return {
      requiresEmailConfirmation:
        result.requiresEmailConfirmation,
    };
  };

  const signOut = async () => {
    await signOutApi();
    setCustomer(null);
  };

  return (
    <AuthContext.Provider
      value={{
        customer,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider',
    );
  }

  return context;
}
