export const metadata = {
  title: "Aurevia AI",
  description: "AI Career Assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        style={{
          margin: 0,
          padding: 0,
          background: "#020617",
          overflowX: "hidden",
          fontFamily:
            "Inter, Arial, sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}