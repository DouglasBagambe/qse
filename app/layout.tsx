// app/layout.tsx

"use client";
import { usePathname } from "next/navigation";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Web3Provider } from "./components/Web3Provider";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Define routes where Header and Footer should not be displayed
  const hideHeaderFooter = ["/token-theory"];

  const shouldHideHeaderFooter = hideHeaderFooter.includes(pathname);

  return (
    <html lang="en">
      <body>
        <Web3Provider>
          <div className="App">
            {!shouldHideHeaderFooter && <Header />}
            {children}
            {!shouldHideHeaderFooter && <Footer />}
          </div>
        </Web3Provider>
      </body>
    </html>
  );
}
