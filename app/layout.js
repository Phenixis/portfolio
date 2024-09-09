// import { inter, lusitana } from '/app/ui/fonts';
import '/app/ui/global.css';
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
      <body className="antialiased bg-amber-50">{children}</body>
    </html>
  );
}