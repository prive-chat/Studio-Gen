import { supabase } from '../lib/supabase';
import { GenResult } from '../types/generator';

export interface DBGeneration {
  id: string;
  user_id: string;
  url: string;
  prompt: string;
  type: 'image' | 'video';
  created_at: string;
  script?: string;
}

export class DBService {
  static async saveGeneration(result: GenResult): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('generations')
      .insert({
        user_id: user.id,
        url: result.url,
        prompt: result.prompt,
        type: result.type,
        script: result.script
      });

    if (error) {
      console.error('Supabase save error:', error.message);
      throw error;
    }
  }

  static async getGenerations(): Promise<GenResult[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('generations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase fetch error:', error.message);
      return [];
    }

    return (data || []).map(item => ({
      type: item.type as 'image' | 'video',
      url: item.url,
      prompt: item.prompt,
      script: item.script
    }));
  }
}
