import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navbar } from '@/components/layout/navbar';
import { Toaster } from 'sonner';
import { PatientProvider } from '@/providers/patient-provider';
import { AuthProvider } from '@/lib/providers/auth-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dr. Sarah Mitchell - Family Medicine Specialist',
  description: 'Professional medical practice offering comprehensive healthcare services for the whole family.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <PatientProvider>
            <Navbar />
            {children}
            <Toaster />
          </PatientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}