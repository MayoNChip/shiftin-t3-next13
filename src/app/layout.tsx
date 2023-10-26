import "~/styles/globals.css";
import { headers } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";
import Navbar from "./_components/Navbar";

export const metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <TRPCReactProvider headers={headers()}>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}