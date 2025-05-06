/* eslint-disable @typescript-eslint/no-unused-vars */
// app/layout.tsx

"use client";
import { usePathname } from "next/navigation";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Web3Provider } from "./components/Web3Provider";
import "./globals.css";
import Head from "next/head";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Define routes where Header and Footer should not be displayed
  const hideHeader = [""];
  const shouldHideHeader = hideHeader.includes(pathname);

  const hideFooter = [""];
  const shouldHideFooter = hideFooter.includes(pathname);

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/assets/favico.svg" />
        {/* Common meta tags can go here */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <Web3Provider>
          <div className="App">
            {!shouldHideHeader && <Header />}
            {children}
            {!shouldHideFooter && <Footer />}
          </div>
        </Web3Provider>
      </body>
    </html>
  );
}
