export const metadata = {
  title: 'FMA Motoshop',
  description: 'OMS + WMS + POS for FMA Motoshop',
  manifest: '/manifest.json',
};

export const viewport = {
  themeColor: '#111827',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          background: '#f5f5f5',
          color: '#111827',
        }}
      >
        {children}
      </body>
    </html>
  );
}
