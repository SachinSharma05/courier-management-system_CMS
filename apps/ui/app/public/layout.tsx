export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <header style={{ padding: 16, borderBottom: '1px solid #ddd' }}>
        <strong>Public Tracking</strong>
      </header>

      <main style={{ padding: 24 }}>{children}</main>
    </section>
  );
}
