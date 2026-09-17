import AppShell from '@/components/AppShell';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="id">
      <body className="antialiased bg-stone-100 text-stone-900">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}