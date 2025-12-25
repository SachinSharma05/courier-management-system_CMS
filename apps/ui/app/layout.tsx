import { ReactQueryProvider } from '@/lib/react-query/provider';
import './globals.css';
import { Providers } from './providers';
import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ReactQueryProvider>
            <Providers>
              {children}
            </Providers>
          </ReactQueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}