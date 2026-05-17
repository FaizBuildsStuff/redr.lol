import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: {
    default: "red.rose",
    template: "%s • red.rose",
  },

  description:
    "Profiles with personality. Create expressive, customizable, and beautifully designed spaces for the modern internet.",

  keywords: [
    "red.rose",
    "profiles",
    "digital identity",
    "link in bio",
    "modern profiles",
    "creator platform",
    "custom profiles",
    "aesthetic profiles",
    "social profile",
  ],

  metadataBase: new URL("https://red.rose"),

  openGraph: {
    title: "red.rose",
    description:
      "Profiles with personality.",
    url: "https://red.rose",
    siteName: "red.rose",
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "red.rose",
    description:
      "Profiles with personality.",
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
    <html lang="en" className="h-full antialiased">
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