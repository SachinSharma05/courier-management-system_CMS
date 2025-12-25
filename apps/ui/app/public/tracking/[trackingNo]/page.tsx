// ui/public/tracking/[trackingNo]/page.tsx
export default function TrackingPage({
  params,
}: {
  params: { trackingNo: string };
}) {
  return <h3>Tracking No: {params.trackingNo}</h3>;
}
