export default function Logo() {
    return (
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-primary/20 border border-primary/30 grid place-items-center">
          <span className="text-primary text-lg font-bold">IY</span>
        </div>
        <div>
          <h1 className="text-2xl font-semibold leading-none">Image Processing Studio</h1>
          <p className="text-xs text-muted leading-none mt-1"></p>
        </div>
      </div>
    );
  }
  