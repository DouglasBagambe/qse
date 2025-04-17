/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

const TeamSection = () => {
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);

  const teamMembers = [
    {
      id: 1,
      name: "Daniel Addison",
      position: "CEO, CTO, Founder",
      bio: "Over 25 years in cybersecurity, founding HCISS with expertise in blockchain and AI analytics.",
      image:
        "https://i0.wp.com/hciss.io/wp-content/uploads/2020/02/Daniel-New-1.jpg?fit=300%2C292&ssl=1",
      social: [
        {
          platform: "facebook",
          url: "https://www.facebook.com/profile.php?id=100006207974808",
          icon: "M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z",
        },
        {
          platform: "twitter",
          url: "https://twitter.com/HCISS_LLC",
          icon: "M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z",
        },
        {
          platform: "linkedin",
          url: "https://www.linkedin.com/in/danieladdison1/",
          icon: "M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z",
        },
        {
          platform: "instagram",
          url: "https://www.instagram.com/hciss_/",
          icon: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.5M7.5 20.5H16A8.5 8.5 0 0 0 24.5 12v-1.5A8.5 8.5 0 0 0 16 2H7.5A8.5 8.5 0 0 0-1 10.5V12a8.5 8.5 0 0 0 8.5 8.5z",
        },
      ],
    },
    {
      id: 2,
      name: "Washington Mugo",
      position: "CSO, Co-Founder",
      bio: "Cybersecurity architect with a strong track record in security model design.",
      image:
        "https://i0.wp.com/hciss.io/wp-content/uploads/2020/02/Washington.png?fit=300%2C298&ssl=1",
      social: [
        {
          platform: "facebook",
          url: "https://www.facebook.com/washie.mugo/",
          icon: "M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z",
        },
        {
          platform: "linkedin",
          url: "https://www.linkedin.com/in/washington-mugo-b754a5114/",
          icon: "M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z",
        },
        {
          platform: "twitter",
          url: "https://twitter.com/Washi_254",
          icon: "M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z",
        },
      ],
    },
    {
      id: 3,
      name: "Arundhati Datta",
      position: "CDO, PMO",
      bio: "20+ years in tech and data analytics, founder of an AI company.",
      image:
        "https://i0.wp.com/hciss.io/wp-content/uploads/2020/02/ArDa.jpeg?fit=300%2C300&ssl=1",
      social: [
        {
          platform: "facebook",
          url: "https://www.facebook.com/arundhati.datta.5",
          icon: "M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z",
        },
        {
          platform: "linkedin",
          url: "https://www.linkedin.com/in/arundhati-datta/",
          icon: "M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z",
        },
        {
          platform: "instagram",
          url: "https://www.instagram.com/arundhati_datta1977/",
          icon: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.5M7.5 20.5H16A8.5 8.5 0 0 0 24.5 12v-1.5A8.5 8.5 0 0 0 16 2H7.5A8.5 8.5 0 0 0-1 10.5V12a8.5 8.5 0 0 0 8.5 8.5z",
        },
      ],
    },
    {
      id: 4,
      name: "Joel Odelson",
      position: "CISO",
      bio: "Leads global cybersecurity with expertise in NIST and GDPR frameworks.",
      image:
        "https://i0.wp.com/hciss.io/wp-content/uploads/2020/02/joel.jpg?fit=285%2C300&ssl=1",
      social: [
        {
          platform: "linkedin",
          url: "https://www.linkedin.com/in/joel-odelson/",
          icon: "M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z",
        },
      ],
    },
  ];

  return (
    <section className="py-20 bg-blue-700 text-white relative overflow-hidden">
      {/* Background design elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full opacity-20 -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full opacity-10 -ml-40 -mb-40"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
            THE TEAM
          </h2>
          <div className="w-24 h-1 bg-blue-400 mx-auto mb-6"></div>
          <p className="text-xl max-w-2xl mx-auto text-blue-100">
            Meet the experts behind Quantum SEC who are revolutionizing how we
            pay for charging electric vehicles.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
              onMouseEnter={() => setHoveredMember(member.id)}
              onMouseLeave={() => setHoveredMember(null)}
            >
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-800 to-blue-900 shadow-xl group">
                {/* Card inner border glow effect */}
                <div className="absolute inset-0 rounded-xl border border-blue-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>

                {/* Image container */}
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Overlay on hover with social icons */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900 via-blue-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <div className="flex space-x-3 mb-4">
                      {member.social.map((social, i) => (
                        <a
                          key={i}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-blue-500 flex items-center justify-center transition-all duration-300 hover:scale-110"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-white"
                          >
                            <path d={social.icon}></path>
                          </svg>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 bg-white/5 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-blue-300 font-medium mb-3">
                    {member.position}
                  </p>
                  <p className="text-sm text-blue-100 opacity-80">
                    {member.bio}
                  </p>
                </div>
              </div>

              {/* Mobile social icons - always visible on mobile */}
              <div className="md:hidden flex mt-3 space-x-2 justify-center">
                {member.social.map((social, i) => (
                  <a
                    key={i}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center transition-all duration-300 hover:bg-blue-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white"
                    >
                      <path d={social.icon}></path>
                    </svg>
                  </a>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
