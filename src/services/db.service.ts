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
  private static async uploadToStorage(dataUrl: string, path: string): Promise<string> {
    const base64 = dataUrl.split(',')[1];
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/png' });

    const { data, error } = await supabase.storage
      .from('gallery_assets')
      .upload(path, blob, {
        contentType: 'image/png',
        upsert: true
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('gallery_assets')
      .getPublicUrl(path);

    return publicUrl;
  }

  static async saveGeneration(result: GenResult): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let finalUrl = result.url;

    // If it's a data URL, upload to storage first for efficiency and multi-device access
    if (result.url.startsWith('data:')) {
      const filename = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
      try {
        finalUrl = await this.uploadToStorage(result.url, filename);
      } catch (err) {
        console.error('Storage upload failed, saving as data URL fallback:', err);
      }
    }

    const { error } = await supabase
      .from('generations')
      .insert({
        user_id: user.id,
        url: finalUrl,
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

  static subscribeToGenerations(callback: (payload: any) => void) {
    return supabase
      .channel('generations_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'generations' },
        callback
      )
      .subscribe();
  }
}
