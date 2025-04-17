// app/layout.tsx

import { Metadata } from "next";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Web3Provider } from "./components/Web3Provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "QSE",
  description: "QSE ICO Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Web3Provider>
          <div className="App">
            <Header />
            {children}
            <Footer />
          </div>
        </Web3Provider>
      </body>
    </html>
  );
}
