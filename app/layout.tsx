import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: {
    default: "redr.lol",
    template: "%s • redr.lol",
  },

  description:
    "Build expressive digital identities with modern customization, smooth animations, profile effects, and creative freedom.",

  keywords: [
    "redr.lol",
    "redr",
    "profiles",
    "digital identity",
    "link in bio",
    "modern profiles",
    "creator platform",
    "custom profiles",
    "aesthetic profiles",
    "social profile",
    "animated profiles",
    "modern bio pages",
    "internet identity",
  ],

  metadataBase: new URL("https://redr.lol"),

  openGraph: {
    title: "redr.lol",
    description:
      "Build expressive digital identities with modern customization and profile effects.",
    url: "https://redr.lol",
    siteName: "redr.lol",
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "redr.lol",
    description:
      "Build expressive digital identities with modern customization and profile effects.",
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap"
        />
      </head>

      <body className="min-h-full flex flex-col bg-[#0D0D0D] text-[#F5F1E8] font-['Satoshi'] overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}