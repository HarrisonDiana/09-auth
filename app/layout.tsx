import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import AuthProvider from "@/components/AuthProvider/AuthProvider";

export const metadata: Metadata = {
  title: "NoteHub",
  description: "NoteHub is a simple and efficient app for managing personal notes.",
  openGraph: {
    title: "NoteHub",
    description: "NoteHub is a simple and efficient app for managing personal notes.",
    url: "https://08-zustand-three-rho.vercel.app",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub Open Graph Image",
      },
    ],
    type: "website",
    siteName: "NoteHub",
  },
  twitter: {
    card: "summary_large_image",
    title: "NoteHub",
    description: "NoteHub is a simple and efficient app for managing personal notes.",
    images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
  },
};

const roboto = Roboto({
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
  subsets: ["latin"],
});

type RootLayoutProps = {
  children: React.ReactNode;
  modal?: React.ReactNode;
};

export default function RootLayout({ children, modal }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${roboto.variable}`}>
        <TanStackProvider>
          <AuthProvider>
            <Header />
            <main>{children}</main>
            {modal && <div id="modal-slot">{modal}</div>}
            <Footer />
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}