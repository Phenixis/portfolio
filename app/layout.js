// import { inter, lusitana } from '@/app/ui/fonts';
import { Metadata } from 'next';
 
export const metadata = {
  title: {
    template: '%s | Maxime Duhamel',
    default: 'Maxime Duhamel',
  },
  description: 'Portfolio by Maxime Duhamel.',
};

export default function RootLayout({children}) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}