import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

// Validation schemas
const emailSchema = z.string().email("Invalid email address").max(255, "Email too long");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters").max(100, "Password too long");

// Hash function for session logging (simple hash for demo - use crypto.subtle in production)
const hashToken = (token: string): string => {
  return btoa(token.slice(0, 10) + '...' + token.slice(-10));
};

class AuthAPI {
  async login(email: string, password: string) {
    // Validate inputs
    emailSchema.parse(email);
    passwordSchema.parse(password);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      // Log session information
      if (data.session) {
        await this.logSession(data.session, 'login');
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async signup(email: string, password: string, displayName?: string) {
    // Validate inputs
    emailSchema.parse(email);
    passwordSchema.parse(password);

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            display_name: displayName || email.split('@')[0]
          }
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      // Log session information if user is immediately logged in
      if (data.session) {
        await this.logSession(data.session, 'signup');
      }

      return data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  async logout() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Update session log before logout
        await this.updateSessionLog(session.access_token, 'logout');
      }

      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data.session;
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  }

  async getUser() {
    try {
      const { data, error } = await supabase.auth.getUser();
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data.user;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

  // Session logging methods
  private async logSession(session: any, action: 'login' | 'signup') {
    try {
      const userAgent = navigator.userAgent;
      const sessionId = session.access_token.split('.')[0]; // Use part of token as session ID
      
      await supabase.from('session_logs').insert({
        user_id: session.user.id,
        session_id: sessionId,
        access_token_hash: hashToken(session.access_token),
        refresh_token_hash: session.refresh_token ? hashToken(session.refresh_token) : null,
        user_agent: userAgent,
        expires_at: new Date(session.expires_at * 1000).toISOString(),
        is_active: true
      });
    } catch (error) {
      // Don't throw - session logging is not critical
      console.error('Session logging error:', error);
    }
  }

  private async updateSessionLog(accessToken: string, action: 'logout') {
    try {
      const sessionId = accessToken.split('.')[0];
      
      await supabase
        .from('session_logs')
        .update({ 
          logout_at: new Date().toISOString(),
          is_active: false 
        })
        .eq('session_id', sessionId)
        .eq('is_active', true);
    } catch (error) {
      console.error('Session log update error:', error);
    }
  }

  async isAuthenticated() {
    const session = await this.getSession();
    return !!session;
  }
}

export const authApi = new AuthAPI();