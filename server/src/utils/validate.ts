export function toPositiveInt(value: unknown, name: string): number {
    const n = typeof value === 'string' ? Number.parseInt(value, 10) : Number(value);
    if (!Number.isFinite(n) || n <= 0) {
      const err: any = new Error(`Invalid ${name}: must be a positive integer`);
      err.status = 400;
      err.details = { [name]: value };
      throw err;
    }
    return n;
  }
  
  export function validateQuery(q: Record<string, unknown>): {
    filename: string; width: number; height: number
  } {
    const filename = typeof q.filename === 'string' && q.filename.trim().length > 0 ? q.filename.trim() : null;
    if (!filename) {
      const err: any = new Error('Invalid filename');
      err.status = 400;
      err.details = { filename: q.filename };
      throw err;
    }
    const width = toPositiveInt(q.width, 'width');
    const height = toPositiveInt(q.height, 'height');
    return { filename, width, height };
  }
  