/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";

const TeamSection = () => {
  // Social icon mapping
  const iconMapping = {
    facebook: <FaFacebook size={16} />,
    twitter: <FaTwitter size={16} />,
    linkedin: <FaLinkedinIn size={16} />,
    instagram: <FaInstagram size={16} />,
  };

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
        },
        { platform: "twitter", url: "https://twitter.com/HCISS_LLC" },
        {
          platform: "linkedin",
          url: "https://www.linkedin.com/in/danieladdison1/",
        },
        { platform: "instagram", url: "https://www.instagram.com/hciss_/" },
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
        { platform: "facebook", url: "https://www.facebook.com/washie.mugo/" },
        {
          platform: "linkedin",
          url: "https://www.linkedin.com/in/washington-mugo-b754a5114/",
        },
        { platform: "twitter", url: "https://twitter.com/Washi_254" },
      ],
    },
    {
      id: 3,
      name: "Joel Odelson",
      position: "CISO",
      bio: "Leads global cybersecurity with expertise in NIST and GDPR frameworks.",
      image:
        "https://i0.wp.com/hciss.io/wp-content/uploads/2020/02/joel.jpg?fit=285%2C300&ssl=1",
      social: [
        {
          platform: "linkedin",
          url: "https://www.linkedin.com/in/joel-odelson/",
        },
      ],
    },
    {
      id: 4,
      name: "Mark Santiago",
      position: "",
      bio: "",
      image: "/assets/team/Mark-Santiago.png",
      social: [
        {
          platform: "linkedin",
          url: "https://www.linkedin.com/in/mark-santiago/",
        },
        { platform: "twitter", url: "https://twitter.com/mark_santiago" },
      ],
    },
    {
      id: 5,
      name: "Douglas Bagambe",
      position: "",
      bio: "",
      image: "/assets/team/Douglas-Bagambe.jpg",
      social: [
        {
          platform: "linkedin",
          url: "www.linkedin.com/in/ainamaani-douglas-bagambe-851480254",
        },
        { platform: "twitter", url: "https://twitter.com/realdyson_" },
      ],
    },
  ];

  // Define TypeScript interfaces
  interface SocialLink {
    platform: string;
    url: string;
  }

  interface TeamMemberData {
    id: number;
    name: string;
    position: string;
    bio: string;
    image: string;
    social: SocialLink[];
  }

  interface SocialIconProps {
    social: SocialLink;
  }

  // Social Icon Component
  const SocialIcon = ({ social }: SocialIconProps) => (
    <a
      href={social.url}
      target="_blank"
      rel="noopener noreferrer"
      className="w-8 h-8 rounded-full bg-white/20 hover:bg-blue-400 flex items-center justify-center transition-colors duration-200"
    >
      {iconMapping[social.platform as keyof typeof iconMapping]}
    </a>
  );

  // Team Member Card Component
  const TeamMemberCard = ({ member }: { member: TeamMemberData }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex flex-col rounded-xl overflow-hidden bg-gradient-to-b from-blue-800 to-blue-900 shadow-lg w-full max-w-xs"
      >
        <div className="relative group">
          {/* Image with overlay */}
          <div className="relative h-72 overflow-hidden">
            <img
              src={member.image}
              alt={member.name}
              className="w-full h-full object-cover object-center"
            />

            {/* Subtle image zoom on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out flex items-end">
              <div className="w-full p-4 flex justify-center space-x-3">
                {member.social.map((social, idx) => (
                  <SocialIcon key={idx} social={social} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content area with smooth reveal on hover */}
        <div className="p-5 flex-grow flex flex-col">
          <h3 className="text-xl font-bold text-white">{member.name}</h3>
          <p className="text-blue-300 text-sm mb-2">{member.position}</p>
          <p className="text-blue-100/80 text-sm">{member.bio}</p>
        </div>
      </motion.div>
    );
  };

  return (
    <section className="bg-blue-700 py-16 overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="rounded-2xl bg-gradient-to-r from-blue-700 to-blue-700 text-white p-8 md:p-12 overflow-hidden relative">
          {/* Background design elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-700 rounded-full opacity-20 -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-700 rounded-full opacity-10 -ml-40 -mb-40"></div>

          <div className="relative z-10">
            {/* Section header */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl md:text-5xl font-bold mb-4 bg-clip-text text-white">
                THE TEAM
              </h2>
              <div className="w-20 h-1 bg-blue-300 mx-auto mb-6"></div>
              <p className="text-lg md:text-xl max-w-2xl mx-auto text-blue-100">
                Meet the experts behind QuantumSEC who are revolutionizing how
                we pay for charging electric vehicles.
              </p>
            </motion.div>

            {/* Top row - 3 team members */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-12">
              {teamMembers.slice(0, 3).map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
            </div>

            {/* Bottom row - 2 team members, centered */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 mx-auto">
              <div className="flex gap-8 justify-center">
                {teamMembers.slice(3, 5).map((member) => (
                  <TeamMemberCard key={member.id} member={member} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
