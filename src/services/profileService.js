import { supabase } from '../core/config/supabase';

export const profileService = {
  /**
   * Fetches profile data for ID 1. Optionally accepts a specific column select string.
   */
  async getProfile(selectColumns = '*') {
    const { data, error } = await supabase
      .from('profiles')
      .select(selectColumns)
      .eq('id', 1)
      .single();
    if (error) throw error;
    return data;
  },

  /**
   * Updates profile data for ID 1.
   */
  async updateProfile(payload) {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...payload,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1);
    if (error) throw error;
    return data;
  },

  /**
   * Subscribes to real-time changes on the profiles table.
   */
  subscribeToChanges(channelName, callback, filter = null) {
    const channelConfig = {
      event: '*',
      schema: 'public',
      table: 'profiles',
    };
    if (filter) {
      channelConfig.filter = filter;
    }

    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', channelConfig, (payload) => {
        callback(payload);
      })
      .subscribe();

    return channel;
  },

  /**
   * Removes a subscription channel.
   */
  unsubscribe(channel) {
    if (channel) {
      supabase.removeChannel(channel);
    }
  },

  /**
   * Streams a file to the 'avatars' storage bucket.
   */
  async uploadAvatar(filePath, file) {
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { cacheControl: '3600', upsert: true });
    if (error) throw error;
    return data;
  },

  /**
   * Generates public URL for a file located in the 'avatars' storage bucket.
   */
  getAvatarPublicUrl(filePath) {
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);
    return publicUrl;
  }
};
