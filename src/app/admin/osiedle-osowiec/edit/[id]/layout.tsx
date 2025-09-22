import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Edycja lokalu | Panel Administracyjny - Osiedle Osowiec",
  description: "Edycja lokalu w panelu administracyjnym Osiedle Osowiec.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function EditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
