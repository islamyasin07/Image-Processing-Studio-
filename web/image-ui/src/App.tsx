import { useEffect, useMemo, useState } from 'react';
import Logo from './components/Logo';
import Spinner from './components/Spinner';
import TransitionImage from './components/TransitionImage';
import { apiBaseUrl, fetchImageList, buildImageUrl } from './lib/api';

export default function App() {
  const [images, setImages] = useState<string[]>([]);
  const [filename, setFilename] = useState('');
  const [width, setWidth] = useState(1200);
  const [height, setHeight] = useState(800);

  const [lockRatio, setLockRatio] = useState(true);
  const ratio = useMemo(() => width / height, [width, height]);

  
  const [url, setUrl] = useState<string | null>(null);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchImageList().then(setImages).catch(() => setImages([]));
  }, []);

  const canGenerate = useMemo(() => !!filename && width > 0 && height > 0, [filename, width, height]);

  const onWidth = (val: number) => {
    setWidth(val);
    if (lockRatio && ratio > 0) setHeight(Math.max(1, Math.round(val / ratio)));
  };
  const onHeight = (val: number) => {
    setHeight(val);
    if (lockRatio && ratio > 0) setWidth(Math.max(1, Math.round(val * ratio)));
  };

  const onGenerate = async () => {
    setError(null);
    setLoading(true);
    setNatural(null);
    try {
      const u = buildImageUrl(filename, width, height);
      setUrl(u);
    } catch (e: any) {
      setError(e?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const onCopy = async () => {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    alert('Copied!');
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/[0.08] to-transparent">
      {/* Header */}
      <header className="max-w-6xl mx-auto px-5 pt-10 pb-6">
        <div className="flex items-center justify-between">
          <Logo />
          <a
            href={apiBaseUrl()}
            className="text-sm text-muted hover:text-foreground underline underline-offset-4"
            target="_blank" rel="noreferrer"
          >
            API Base
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 grid lg:grid-cols-2 gap-6 pb-16">
        <section className="card">
          <h2 className="text-lg mb-4 font-medium">Request</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm text-muted">Filename</label>
              <select className="select" value={filename} onChange={(e) => setFilename(e.target.value)}>
                <option value="">Select an image…</option>
                {images.map((n) => (
                  <option key={n} value={n}>{n}.jpg</option>
                ))}
              </select>
              <p className="mt-1 text-xs text-muted">
                Originals live in the server’s <code>assets/full</code> folder.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 text-sm text-muted">Width (px)</label>
                <input
                  type="number" min={1}
                  className="input"
                  value={width}
                  onChange={(e) => onWidth(parseInt(e.target.value || '0', 10))}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm text-muted">Height (px)</label>
                <input
                  type="number" min={1}
                  className="input"
                  value={height}
                  onChange={(e) => onHeight(parseInt(e.target.value || '0', 10))}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button onClick={() => setLockRatio((v) => !v)} className="btn bg-background border border-white/10">
                {lockRatio ? 'Unlock ratio' : 'Lock ratio'}
              </button>
              {[{w:200,h:200},{w:400,h:300},{w:800,h:600},{w:1200,h:800}].map(p => (
                <button key={`${p.w}x${p.h}`} onClick={() => { setWidth(p.w); setHeight(p.h); }}
                        className="btn bg-primary/20 border border-primary/30">
                  {p.w}×{p.h}
                </button>
              ))}
            </div>

            {/* action */}
            <button
              onClick={onGenerate}
              disabled={!canGenerate || loading}
              className="btn bg-primary text-black disabled:opacity-50"
            >
              {loading ? 'Processing…' : 'Generate'}
            </button>
            {error && <p className="text-red-400 text-sm">{error}</p>}
          </div>
        </section>

        {/* Preview */}
        <section className="card">
          <h2 className="text-lg mb-4 font-medium">Preview</h2>

          {!url ? (
            <div className="space-y-3">
              <div className="rounded-2xl overflow-hidden border border-white/10">
                <div className="h-64 shimmer" />
              </div>
              <Spinner label="Waiting for your first generate…" />
            </div>
          ) : (
            <div className="space-y-4">
              <TransitionImage
                src={url}
                alt="Processed"
                onLoaded={(sz) => setNatural(sz)}
              />
              <div className="flex gap-2 flex-wrap">
                <a href={url} download className="btn bg-secondary text-black">Download</a>
                <button onClick={onCopy} className="btn bg-background border border-white/10">Copy URL</button>
              </div>
              <div className="text-sm text-muted flex items-center gap-3">
                {natural && <span>Actual: {natural.w}×{natural.h}px</span>}
                <span className="opacity-50">•</span>
                <code className="break-all">{url}</code>
              </div>
            </div>
          )}
        </section>
      </main>

      
    
    </div>
  );
}
