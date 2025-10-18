
export type ValidParams =
  | { ok: true; filename: string; width: number; height: number }
  | { ok: false; status: 400 | 404; message: string };

const NUM_RE = /^\d+$/;
const NAME_RE = /^[a-z]+$/i;

export function validateQuery(q: any): ValidParams {
  const { filename, width, height } = q ?? {};

  if (!filename || typeof filename !== 'string') {
    return { ok: false, status: 400, message: 'Missing "filename".' };
  }
  if (!NAME_RE.test(filename)) {
    return {
      ok: false,
      status: 400,
      message: 'Invalid "filename": use letters only (e.g., fjord).',
    };
  }

  if (width === undefined) {
    return { ok: false, status: 400, message: 'Missing "width".' };
  }
  if (!NUM_RE.test(String(width))) {
    return {
      ok: false,
      status: 400,
      message: 'Invalid "width": must be a positive integer.',
    };
  }

  if (height === undefined) {
    return { ok: false, status: 400, message: 'Missing "height".' };
  }
  if (!NUM_RE.test(String(height))) {
    return {
      ok: false,
      status: 400,
      message: 'Invalid "height": must be a positive integer.',
    };
  }

  const w = Number(width);
  const h = Number(height);
  if (w <= 0 || h <= 0) {
    return {
      ok: false,
      status: 400,
      message: 'Invalid dimensions: "width" and "height" must be > 0.',
    };
  }

  const MAX = 5000;
  if (w > MAX || h > MAX) {
    return {
      ok: false,
      status: 400,
      message: `Dimensions too large. Max allowed is ${MAX}x${MAX}.`,
    };
  }

  return { ok: true, filename, width: w, height: h };
}
