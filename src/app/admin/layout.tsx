import { Metadata } from 'next';
import AdminClient from './AdminClient';

export const metadata: Metadata = {
  title: "Panel Administracyjny | Osiedle Osowiec",
  description: "Panel administracyjny Osiedle Osowiec - zarządzanie lokalami, cenami i dostępnością.",
  openGraph: {
    title: "Panel Administracyjny | Osiedle Osowiec",
    description: "Panel administracyjny Osiedle Osowiec - zarządzanie lokalami, cenami i dostępnością.",
    url: "https://www.aksima.pl/admin",
  },
  alternates: {
    canonical: "https://www.aksima.pl/admin",
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
