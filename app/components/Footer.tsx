/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import {
  Instagram,
  Twitter,
  Facebook,
  MessageCircle,
  Send,
  Linkedin,
} from "lucide-react";

const Footer = () => {
  const handleDownload = () => {
    const fileUrl = "/assets/whitepaper/QSE_TokenEVCI_Use Case.pdf";

    // Create a temporary link element
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", "QSE_TokenEVCI_Use Case.pdf"); // Set the download attribute
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <footer className="bg-[#0d0d2b] pt-[50px] pb-[30px] text-white body-font">
      <div className="max-w-[1300px] px-5 lg:pt-[50px] mx-auto">
        <div className="flex flex-wrap md:text-left text-center order-first">
          <div className="lg:w-1/4 md:w-1/2 w-full px-4 lg:mt-0 mt-[30px]">
            <a href="index.html">
              <div className="spin"></div>
              <span className="flex m-auto text-center mt-2 inline-block text-xl ml-5 md:ml-[1.5rem]">
                QSE
              </span>
            </a>
          </div>
          <div className="lg:w-1/4 md:w-1/2 w-full px-4 lg:mt-0 mt-[30px]">
            <h2 className="title-font font-medium text-white tracking-widest text-sm mb-3">
              Application
            </h2>
            <nav className="flex flex-col justify-center md:items-start items-center  list-none mb-10">
              <a href="" className="mb-2 inline-block">
                <div className="flex items-center">
                  <img src="assets/app.png" className="h-5 w-5 mr-2 " />
                  <p>App Store</p>
                </div>
              </a>
              <a href=" " className="mb-2 inline-block">
                <div className="flex items-center">
                  <img src="assets/play.png" className="h-5 w-5 mr-2" />
                  <p>Play Store</p>
                </div>
              </a>
            </nav>
          </div>
          <div className="lg:w-1/4 md:w-1/2 w-full px-4 lg:mt-0 mt-[30px]">
            <h2 className="title-font font-medium text-white tracking-widest text-sm mb-3">
              Conditions
            </h2>
            <nav className="list-none mb-10">
              <li>
                <a
                  href="#"
                  className="text-white hover:text-white cursor-pointer"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white hover:text-white cursor-pointer"
                >
                  Anti Fraud Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white hover:text-white cursor-pointer"
                >
                  Cookie Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white hover:text-white cursor-pointer"
                >
                  Terms of Credits
                </a>
              </li>
              <li>
                <a
                  href="javsscript:void(0);"
                  className="text-white hover:text-white cursor-pointer"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="javsscript:void(0);"
                  className="text-white hover:text-white cursor-pointer"
                >
                  Terms of Use
                </a>
              </li>
              <li>
                <a
                  href="javsscript:void(0);"
                  className="text-white hover:text-white cursor-pointer"
                >
                  Terms of Exchange
                </a>
              </li>
            </nav>
          </div>
          <div className="lg:w-1/4 md:w-1/2 w-full px-4 lg:mt-0 mt-[30px]">
            <h2 className="title-font font-medium text-white tracking-widest text-sm mb-5">
              Follow Us
            </h2>
            <div className="grid xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-5 grid-cols-4 mt-3 gap-2">
              <a href="#" className="mb-2 mx-auto">
                <div className="border border-[#952dc0] hover:bg-[#952dc0] transition-colors duration-300 rounded-full w-[45px] h-[45px] flex items-center justify-center">
                  <Instagram className="text-[#952dc0] hover:text-white w-5 h-5" />
                </div>
              </a>
              <a href="#" className="mb-2 mx-auto">
                <div className="border border-[#952dc0] hover:bg-[#952dc0] transition-colors duration-300 rounded-full w-[45px] h-[45px] flex items-center justify-center">
                  <Twitter className="text-[#952dc0] hover:text-white w-5 h-5" />
                </div>
              </a>
              <a href="#" className="mb-2 mx-auto">
                <div className="border border-[#952dc0] hover:bg-[#952dc0] transition-colors duration-300 rounded-full w-[45px] h-[45px] flex items-center justify-center">
                  <Facebook className="text-[#952dc0] hover:text-white w-5 h-5" />
                </div>
              </a>
              <a href="#" className="mb-2 mx-auto">
                <div className="border border-[#952dc0] hover:bg-[#952dc0] transition-colors duration-300 rounded-full w-[45px] h-[45px] flex items-center justify-center">
                  <MessageCircle className="text-[#952dc0] hover:text-white w-5 h-5" />
                </div>
              </a>
              <a href="#" className="mb-2 mx-auto">
                <div className="border border-[#952dc0] hover:bg-[#952dc0] transition-colors duration-300 rounded-full w-[45px] h-[45px] flex items-center justify-center">
                  <Send className="text-[#952dc0] hover:text-white w-5 h-5" />
                </div>
              </a>
              <a href="#" className="mb-2 mx-auto">
                <div className="border border-[#952dc0] hover:bg-[#952dc0] transition-colors duration-300 rounded-full w-[45px] h-[45px] flex items-center justify-center">
                  <Linkedin className="text-[#952dc0] hover:text-white w-5 h-5" />
                </div>
              </a>
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleDownload}
                className="text-white border border-[#952dc0] rounded-full px-6 py-2 mt-8 inline-block hover:bg-[#952dc0] transition-colors duration-300"
              >
                Download Whitepaper
              </button>
            </div>
          </div>
        </div>
        <p className="text-center text-white pt-[50px]">
          ©2025 QSE. All rights reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
