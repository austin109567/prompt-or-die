import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your configuration.');
}

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);

// Authentication helpers
export async function signUp(email: string, password: string, handle: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    // Insert user data into the public.users table
    if (data.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email,
          handle
        });

      if (profileError) {
        throw profileError;
      }
    }

    return data;
  } catch (err: any) {
    const message = err?.message || 'Supabase sign up failed';
    console.error('Sign up error:', err);
    throw new Error(message);
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (err: any) {
    const message = err?.message || 'Supabase sign in failed';
    console.error('Sign in error:', err);
    throw new Error(message);
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    return true;
  } catch (err: any) {
    const message = err?.message || 'Supabase sign out failed';
    console.error('Sign out error:', err);
    throw new Error(message);
  }
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data?.user;
}

// Session management
export function subscribeToAuthChanges(callback: (event: string, session: any) => void) {
  return supabase.auth.onAuthStateChange(callback);
}