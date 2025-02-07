import "~/app/globals.css";
import "react-day-picker/dist/style.css";

import { Quicksand } from "next/font/google";

import { cn } from "@packages/ui/lib/utils";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          quicksand.className,
        )}
      >
        {children}
      </body>
    </html>
  );
}
