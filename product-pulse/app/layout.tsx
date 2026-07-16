import type { Metadata } from "next";
import { IntroLoader } from "@/components/IntroLoader";
import "./globals.css";

export const metadata: Metadata = {
  title: "ProductPulse | Review intelligence for product strategy",
  description:
    "Turn customer review CSV files into sentiment, pain points, feature requests, recommendations, and roadmap insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <IntroLoader />
        {children}
      </body>
    </html>
  );
}
