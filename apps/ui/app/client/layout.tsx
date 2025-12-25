export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <header style={{ padding: 16, borderBottom: '1px solid #ddd' }}>
        <strong>Client Panel</strong>
      </header>

      <main style={{ padding: 24 }}>{children}</main>
    </section>
  );
}
