import { useEffect, useState } from 'react';

type Props = {
  src: string | null;
  alt?: string;
  onLoaded?: (size: { w: number; h: number }) => void;
};

export default function TransitionImage({ src, alt = '', onLoaded }: Props) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
  }, [src]);

  if (!src) {
    return (
      <div className="rounded-2xl overflow-hidden border border-white/10">
        <div className="h-64 shimmer" />
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl border border-white/10 overflow-hidden">
      {!loaded && <div className="absolute inset-0 shimmer" />}
      {!loaded && (
        <div className="absolute inset-0 grid place-items-center">
          <div className="h-8 w-8 border-2 border-white/20 border-t-white/70 rounded-full animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`block w-full h-auto transition duration-500 ease-out
                    ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        onLoad={(e) => {
          const img = e.currentTarget;
          setLoaded(true);
          onLoaded?.({ w: img.naturalWidth, h: img.naturalHeight });
        }}
      />
    </div>
  );
}
