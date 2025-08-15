import { ReactNode } from 'react';
import "./globals.css";

type Props = {
  children: ReactNode;
};

export default function RootLayout({children}: Props) {
  return (
    <html suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}