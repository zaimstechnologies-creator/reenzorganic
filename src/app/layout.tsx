import type { Metadata } from "next";
import "./globals.css";
import "./storefront.css";
export const metadata: Metadata = {
  title: "Reenz Organic | Thoughtful favorites, inspired by nature",
  description:
    "Shop Reenz Organic's thoughtful collection of dried fruits, pantry favorites, ghee and honey.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
