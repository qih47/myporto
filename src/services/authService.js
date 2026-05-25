import { supabase } from '../core/config/supabase';

export const authService = {
  /**
   * Retrieves the current active session.
   */
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  /**
   * Subscribes to changes in authentication state.
   */
  onAuthStateChange(callback) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
    return subscription;
  },

  /**
   * Authenticates a user using email and password.
   */
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  /**
   * Destroys the active session (logs out).
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
};
