import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.');
}

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export type Inscription = {
  id: string;
  boutique_name: string;
  buyer_name: string;
  email: string;
  phone: string;
  address: string;
  collections: string;
  created_at?: string;
  updated_at?: string;
};

export type CollectionSetting = {
  id: number;
  name: string;
  tagline: string;
  img: string;
  tag: string;
};

export type SiteSettings = {
  hero_img: string;
  essence_img: string;
  collections: CollectionSetting[];
};

class SupabaseWrapper {
  private client = supabaseClient;

  async addInscription(data: Omit<Inscription, 'id' | 'created_at' | 'updated_at'>) {
    const { data: result, error } = await this.client
      .from('inscriptions')
      .insert([data])
      .select();
    if (error) throw error;
    return result?.[0];
  }

  async getInscriptions() {
    const { data, error } = await this.client
      .from('inscriptions')
      .select('*');
    if (error) throw error;
    return data;
  }

  async getInscriptionById(id: string) {
    const { data, error } = await this.client
      .from('inscriptions')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  async updateInscription(id: string, updates: Partial<Inscription>) {
    const { data, error } = await this.client
      .from('inscriptions')
      .update(updates)
      .eq('id', id)
      .select();
    if (error) throw error;
    return data?.[0];
  }

  async deleteInscription(id: string) {
    const { error } = await this.client
      .from('inscriptions')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }

  async getSiteSettings(): Promise<SiteSettings | null> {
    const { data, error } = await this.client
      .from('site_settings')
      .select('value')
      .eq('key', 'main')
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data?.value || null;
  }

  async saveSiteSettings(data: SiteSettings): Promise<void> {
    const { error } = await this.client
      .from('site_settings')
      .upsert({ key: 'main', value: data }, { onConflict: 'key' });
    if (error) throw error;
  }
}

export const supabase = new SupabaseWrapper();
