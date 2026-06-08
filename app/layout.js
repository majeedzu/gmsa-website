import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  title: "GMSA-HTU | Ghana Muslim Students' Association - Ho Technical University",
  description: "Official digital presence of the Ghana Muslim Students' Association (GMSA-HTU), Ho Technical University branch. Access daily Quran verses, Hadiths, local prayer times, Islamic resources, announcements, and events.",
  keywords: ["GMSA", "HTU", "Ghana Muslim Students Association", "Ho Technical University", "Islam Ho", "Ghana Muslim Students", "Islamic resources", "Prayer Times Ho"],
  authors: [{ name: "GMSA-HTU IT Team" }],
  viewport: "width=device-width, initial-scale=1.0",
  openGraph: {
    title: "GMSA-HTU | Ghana Muslim Students' Association - Ho Technical University",
    description: "Official digital presence of the Ghana Muslim Students' Association (GMSA-HTU), Ho Technical University branch.",
    url: "https://gmsahtu.com",
    siteName: "GMSA-HTU",
    locale: "en_GH",
    type: "website",
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="flex flex-col min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        <Navbar />
        <main className="flex-grow flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
