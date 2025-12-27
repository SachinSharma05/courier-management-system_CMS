import { ReactQueryProvider } from '@/lib/react-query/provider';
import './globals.css';
import { Providers } from './providers';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';

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
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: { fontSize: '14px' },
                }}
              />
            </Providers>
          </ReactQueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}