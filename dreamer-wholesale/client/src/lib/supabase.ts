// Supabase Configuration
// Replace these values with your Supabase project credentials

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://your-project.supabase.co";
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "your-anon-key";

// Simple Supabase client for HTTP requests (no SDK needed)
export class SupabaseClient {
  private url: string;
  private anonKey: string;

  constructor(url: string, anonKey: string) {
    this.url = url;
    this.anonKey = anonKey;
  }

  async request(
    method: "GET" | "POST" | "PATCH" | "DELETE",
    table: string,
    options?: {
      body?: Record<string, any>;
      filters?: Record<string, any>;
    }
  ) {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.anonKey}`,
      apikey: this.anonKey,
    };

    let url = `${this.url}/rest/v1/${table}`;

    if (options?.filters) {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(options.filters)) {
        params.append(`${key}`, `eq.${value}`);
      }
      url += `?${params.toString()}`;
    }

    const response = await fetch(url, {
      method,
      headers,
      body: options?.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Supabase request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async getInscriptions() {
    return this.request("GET", "inscriptions");
  }

  async addInscription(data: {
    boutique_name: string;
    buyer_name: string;
    email: string;
    phone: string;
    address: string;
    collections: string;
  }) {
    return this.request("POST", "inscriptions", { body: data });
  }

  async updateInscription(id: string, data: Partial<any>) {
    const url = `${this.url}/rest/v1/inscriptions?id=eq.${id}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.anonKey}`,
      apikey: this.anonKey,
    };

    const response = await fetch(url, {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Supabase request failed: ${response.statusText}`);
    }

    return response.json();
  }
}

export const supabase = new SupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);
