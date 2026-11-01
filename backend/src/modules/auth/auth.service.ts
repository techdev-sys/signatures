import type {
  Session,
  User,
} from '@supabase/supabase-js';

import {
  createServerSupabaseClient,
  supabase,
} from '../../database/supabase.js';

function serializeUser(user: User) {
  const metadata = user.user_metadata ?? {};

  return {
    id: user.id,
    email: user.email ?? null,
    phone:
      user.phone ??
      (typeof metadata.phone === 'string'
        ? metadata.phone
        : null),
    fullName:
      typeof metadata.full_name === 'string'
        ? metadata.full_name
        : user.email?.split('@')[0] ?? 'Customer',
  };
}

function serializeSession(session: Session) {
  return {
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
    expiresAt: session.expires_at ?? null,
  };
}

export async function signUpCustomer(input: {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
}) {
  const client = createServerSupabaseClient();
  const { data, error } = await client.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        full_name: input.fullName,
        phone: input.phone ?? null,
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error('Failed to create customer account');
  }

  return {
    user: serializeUser(data.user),
    session: data.session
      ? serializeSession(data.session)
      : null,
    requiresEmailConfirmation: !data.session,
  };
}

export async function signInCustomer(
  email: string,
  password: string,
) {
  const client = createServerSupabaseClient();
  const { data, error } =
    await client.auth.signInWithPassword({
      email,
      password,
    });

  if (error || !data.user || !data.session) {
    throw new Error(
      error?.message ?? 'Failed to sign in',
    );
  }

  return {
    user: serializeUser(data.user),
    session: serializeSession(data.session),
  };
}

export async function refreshCustomerSession(
  refreshToken: string,
) {
  const client = createServerSupabaseClient();
  const { data, error } =
    await client.auth.refreshSession({
      refresh_token: refreshToken,
    });

  if (error || !data.user || !data.session) {
    throw new Error(
      error?.message ?? 'Failed to refresh session',
    );
  }

  return {
    user: serializeUser(data.user),
    session: serializeSession(data.session),
  };
}

export function getCustomerProfile(user: User) {
  return serializeUser(user);
}

export async function signOutCustomer(
  accessToken: string,
) {
  const { error } = await supabase.auth.admin.signOut(
    accessToken,
    'local',
  );

  if (error) {
    throw new Error(error.message);
  }
}
