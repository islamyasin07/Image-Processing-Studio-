export function apiBaseUrl(): string {
    return import.meta.env.VITE_API_BASE || 'http://localhost:3000';
  }
  
  export async function fetchImageList(): Promise<string[]> {
    const res = await fetch(`${apiBaseUrl()}/api/images/list`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.images) ? data.images : [];
  }
  
  export function buildImageUrl(filename: string, width: number, height: number): string {
    const u = new URL('/api/images', apiBaseUrl());
    u.searchParams.set('filename', filename);
    u.searchParams.set('width', String(width));
    u.searchParams.set('height', String(height));
    return u.toString();
  }
  export async function fetchImage(url: string): Promise<Blob> {
    const res = await fetch(url);
    if (!res.ok) {
      let msg = `Request failed (${res.status})`;
      try {
        const data = await res.json();
        if (data?.error) msg = data.error;
      } catch {}
      throw new Error(msg);
    }
    return await res.blob();
  }