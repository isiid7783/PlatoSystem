import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <nav style={{ padding: 20, borderBottom: "1px solid #ccc" }}>
          <Link href="/">Execute</Link>{" | "}
          <Link href="/dashboard">Dashboard</Link>{" | "}
          <Link href="/apikeys">API Keys</Link>{" | "}
          <Link href="/login">Login</Link>{" | "}
          <Link href="/register">Register</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
