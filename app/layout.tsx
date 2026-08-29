import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Muhamad Ganabitz Dzikri | Portfolio",
  description: "Portofolio resmi Muhamad Ganabitz Dzikri (Ganabitz). Menampilkan proyek pengembangan web, sistem IoT, dan multimedia.",
  keywords: ["Muhamad Ganabitz Dzikri", "Ganabitz", "Muhamad Ganabitz", "Portfolio", "Web Developer", "IoT", "Multimedia"],
  authors: [{ name: "Muhamad Ganabitz Dzikri" }],
  alternates: {
    canonical: "https://ganabitz.site",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Muhamad Ganabitz Dzikri | Portfolio",
    description: "Portofolio resmi Muhamad Ganabitz Dzikri (Ganabitz).",
    url: "https://ganabitz.site",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Muhamad Ganabitz Dzikri",
    alternateName: ["Ganabitz", "Muhamad Ganabitz", "Gana"],
    url: "https://ganabitz.site",
    jobTitle: "Technology & Multimedia Specialist",
  };

  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${jakarta.className} bg-[#030303] text-gray-200 antialiased overflow-x-hidden`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}