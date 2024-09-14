// import { inter, lusitana } from '/app/ui/fonts';
import '/app/ui/global.css';
 
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
      <body className="antialiased bg-base-100">{children}</body>
    </html>
  );
}