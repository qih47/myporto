import { supabase } from '../core/config/supabase';

export const projectService = {
  /**
   * Fetches all projects, sorted by creation timestamp descending.
   */
  async getProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  /**
   * Inserts a new project record.
   */
  async addProject(payload) {
    const { data, error } = await supabase
      .from('projects')
      .insert([payload]);
    if (error) throw error;
    return data;
  },

  /**
   * Updates an existing project record.
   */
  async updateProject(id, payload) {
    const { data, error } = await supabase
      .from('projects')
      .update(payload)
      .eq('id', id);
    if (error) throw error;
    return data;
  },

  /**
   * Deletes a project record.
   */
  async deleteProject(id) {
    const { data, error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return data;
  },

  /**
   * Subscribes to real-time additions, updates, or deletions in projects table.
   */
  subscribeToChanges(channelName, callback) {
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, (payload) => {
        callback(payload);
      })
      .subscribe();

    return channel;
  },

  /**
   * Unsubscribes from a channel.
   */
  unsubscribe(channel) {
    if (channel) {
      supabase.removeChannel(channel);
    }
  }
};
