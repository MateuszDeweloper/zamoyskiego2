import { Metadata } from 'next';
import AdminClient from './AdminClient';

export const metadata: Metadata = {
  title: "Panel Administracyjny | Zamoyskiego 2",
  description: "Panel administracyjny Zamoyskiego 2 - zarządzanie lokalami, cenami i dostępnością.",
  openGraph: {
    title: "Panel Administracyjny | Zamoyskiego 2",
    description: "Panel administracyjny Zamoyskiego 2 - zarządzanie lokalami, cenami i dostępnością.",
    url: "https://zamoyskiego2.ascana.pl/78d9f2a1-6b5c-4e8a-9d3f-1c7b2e4f6a8d-admin",
  },
  alternates: {
    canonical: "https://zamoyskiego2.ascana.pl/78d9f2a1-6b5c-4e8a-9d3f-1c7b2e4f6a8d-admin",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminClient>
      {children}
    </AdminClient>
  );
}
