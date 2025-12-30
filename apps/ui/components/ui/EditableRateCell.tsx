import { api } from "@/lib/api/axios";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type EditableRateCellProps = {
  value: number;
  rateCardId: number;
  zoneCode: string;
  slabType: string;
  canEdit: boolean;
  onUpdated?: (v: number) => void;
};

export function EditableRateCell({
  value,
  rateCardId,
  zoneCode,
  slabType,
  canEdit,
  onUpdated,
}: EditableRateCellProps) {
  const [editing, setEditing] = useState(false);
  // 🔥 Change: Initialize as string to avoid leading zeros during input
  const [local, setLocal] = useState(value.toString());
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();
  // Keep local state in sync if prop changes from background refresh
  useEffect(() => {
    setLocal(value.toString());
  }, [value]);

  async function save() {
    const numericValue = Number(local);
    if (numericValue === value) {
      setEditing(false);
      return;
    }

    try {
      setLoading(true);
      await api.patch('/admin/rate-cards/rate', {
        rateCardId,
        zoneCode,
        slabType,
        rate: numericValue,
      });

      queryClient.invalidateQueries({
        queryKey: ['rate-card'],
      });

      onUpdated?.(numericValue);
      toast.success('Rate updated');
      setEditing(false); // Close on success
    } catch {
      setLocal(value.toString());
      toast.error('Failed to update rate');
    } finally {
      setLoading(false);
    }
  }

  if (!canEdit) {
    return <span className="font-bold text-slate-900">{value}</span>;
  }

  return editing ? (
    <input
      type="number"
      // 🔥 Change: Use string value directly
      value={local} 
      autoFocus
      disabled={loading}
      // 🔥 Change: Don't wrap in Number() here, keep it as string
      onChange={(e) => setLocal(e.target.value)}
      onBlur={save}
      onKeyDown={(e) => e.key === 'Enter' && save()}
      onFocus={(e) => e.target.select()} // Select text on click for easier editing
      className="w-20 rounded-lg border border-amber-300 px-2 py-1 text-sm font-bold text-center focus:ring-2 focus:ring-amber-500 outline-none"
    />
  ) : (
    <button
      onClick={() => setEditing(true)}
      className="font-bold text-slate-900 hover:text-amber-600 transition-colors"
    >
      {value}
    </button>
  );
}