export default function Spinner({ label }: { label?: string }) {
    return (
      <div className="flex items-center gap-3 text-sm text-muted">
        <div className="h-5 w-5 border-2 border-white/20 border-t-white/70 rounded-full animate-spin" />
        {label && <span>{label}</span>}
      </div>
    );
  }
  