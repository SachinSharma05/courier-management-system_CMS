type SelectProps = {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
};

export function Select({ label, value, onChange, children }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      <select
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-xl border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none border"
      >
        {children}
      </select>
    </div>
  );
}