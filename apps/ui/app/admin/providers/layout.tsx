'use client';

export default function ProvidersLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[1600px] mx-auto p-2 space-y-2 min-h-screen font-sans bg-slate-50/30">
      {/* ───────────────── PAGE CONTENT TERMINAL ───────────────── */}
      <main className="relative bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden min-h-[600px]">
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}