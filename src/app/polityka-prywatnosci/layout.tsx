import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Polityka Prywatności | ASCANA',
  description: 'Polityka prywatności firmy ASCANA Sp. z o.o. - informacje dotyczące przetwarzania danych osobowych.',
};

export default function PrivacyPolicyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
