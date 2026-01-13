import { redirect } from 'next/navigation';

export default function ProvidersPage() {
  // Ensure we always land on the primary provider's dashboard
  redirect('/admin/providers/delhivery');
}