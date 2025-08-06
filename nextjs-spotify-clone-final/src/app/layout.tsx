import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "../components/ClientLayout";
import Footer from "../components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-black text-white`}>
        {/* Auto logout on browser close */}

        <div className="min-h-screen flex flex-col">
          {/* Main content area with sidebar and page content */}
          <div className="flex flex-1 flex-col sm:flex-row">
            <ClientLayout>
              {children}
            </ClientLayout>
          </div>

          <Footer />
        </div>
      </body>
    </html>
  );
}
