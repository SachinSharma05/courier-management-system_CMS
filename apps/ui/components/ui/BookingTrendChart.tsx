import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, Cell, CartesianGrid 
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import clsx from 'clsx';

interface ChartProps {
  data: any[];
  range: number;
  setRange: (val: number) => void;
}

const CHART_HEIGHT = 250;

export default function BookingTrendChart({ data, range, setRange }: ChartProps) {
  
  // Color logic based on your specific requirements
  const getBarColor = (value: number) => {
    if (value <= 5) return '#f43f5e';   // Red (Critical)
    if (value <= 20) return '#fbbf24';  // Yellow (Low)
    if (value <= 50) return '#3b82f6';  // Blue (Stable)
    if (value <= 100) return '#10b981'; // Green (Good)
    return '#4f46e5';                   // Indigo (Peak)
  };

  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem);
    return `${date.getDate()} ${date.toLocaleString('en-GB', { month: 'short' })}`;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5">
      {/* HEADER & TOGGLES */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <BarChart3 size={16} className="text-indigo-500" /> Booking Trend
        </h2>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            {[7, 14, 30, 45, 60].map((days) => (
              <button
                key={days}
                onClick={() => setRange(days)}
                className={clsx(
                  "px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all",
                  range === days 
                    ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200" 
                    : "text-slate-500 hover:text-slate-800"
                )}
              >
                {days}D
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CHART AREA */}
      <div className="w-full overflow-x-auto custom-scrollbar pb-4">
        <div style={{ width: Math.max(600, data.length * 50), height: CHART_HEIGHT }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="day" 
                tickFormatter={formatXAxis}
                tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 text-white px-3 py-2 rounded-lg shadow-xl border border-slate-800">
                        <p className="text-[10px] font-bold opacity-70 mb-1">{formatXAxis(payload[0].payload.day)}</p>
                        <p className="text-xs font-black">{payload[0].value} Shipments</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="total" radius={[4, 4, 0, 0]} barSize={30}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.total)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* LEGENDS SECTION */}
      <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap gap-4">
        <LegendItem color="bg-rose-500" label="Critical (0-5)" />
        <LegendItem color="bg-amber-400" label="Low (6-20)" />
        <LegendItem color="bg-blue-500" label="Stable (21-50)" />
        <LegendItem color="bg-emerald-500" label="High (51-100)" />
        <LegendItem color="bg-indigo-600" label="Peak (100+)" />
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={clsx("h-2.5 w-2.5 rounded-full", color)} />
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{label}</span>
    </div>
  );
}