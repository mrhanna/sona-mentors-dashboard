import '../styles/globals.css';

export const metadata = {
  title: 'Symphony Mentors',
  description: 'Mentors dashboard scaffold',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1d4ed8" />
      </head>
      <body>{children}</body>
    </html>
  );
}
