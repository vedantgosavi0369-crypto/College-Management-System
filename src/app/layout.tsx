import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/lib/session-context";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CMS – College Management System",
  description: "A modern, role-based web platform for managing college operations including attendance, notices, registers, and grievances.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${roboto.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('cms_theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
