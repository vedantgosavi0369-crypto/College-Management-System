import { SessionProvider } from "@/lib/session-context";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login – CMS",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
