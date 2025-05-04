// FAQ Section Component
import React, { useState } from "react";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is QuantumSEC and how does it work?",
      answer:
        "QuantumSEC is a blockchain-based token designed specifically for electric vehicle charging infrastructure. It uses quantum-resistant cryptography and AI to create a secure payment ecosystem for EV charging stations worldwide.",
    },
    {
      question: "How can I participate in the ICO?",
      answer:
        "You can participate in our ICO by purchasing QSE tokens through our secure platform. Simply click on the 'Buy Token' button, connect your crypto wallet, and follow the instructions to complete your purchase.",
    },
    {
      question: "When will the tokens be distributed?",
      answer:
        "Token distribution will begin immediately after the ICO ends. You will receive your tokens directly in the wallet you used for the purchase. We'll send email notifications when the distribution process begins.",
    },
    {
      question: "What makes QuantumSEC different from other crypto projects?",
      answer:
        "QuantumSEC is unique in its specialized focus on EV charging infrastructure, quantum-resistant security features, AI integration for fraud detection, and partnerships with major charging networks to ensure real-world utility and adoption.",
    },
    {
      question: "Is there a vesting period for team tokens?",
      answer:
        "Yes, team tokens are subject to a vesting period of 24 months with a 6-month cliff. This ensures long-term commitment from our team and prevents market flooding of tokens.",
    },
    {
      question: "Which blockchain does QuantumSEC use?",
      answer:
        "QuantumSEC is built on the Ethereum blockchain as an ERC-20 token, utilizing smart contracts for security and transaction transparency. We're also developing cross-chain compatibility for future expansion.",
    },
    {
      question: "How will QuantumSEC ensure security and prevent fraud?",
      answer:
        "We employ quantum-resistant cryptography, real-time AI monitoring systems, multi-signature wallets for fund management, and regular security audits by third-party firms to ensure the highest level of security and prevent fraud.",
    },
    {
      question: "Where can I view the smart contract?",
      answer:
        "Our smart contract address is published on our website and can be viewed on Etherscan. We encourage all potential investors to review the contract, which has been audited by leading blockchain security firms.",
    },
  ];

  return (
    <section className="py-20 bg-blue-700 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-center mb-12 max-w-2xl mx-auto">
          Find answers to common questions about QuantumCoin, our ICO, and our
          vision for the future.
        </p>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="mb-4 border border-blue-600 rounded-lg overflow-hidden"
            >
              <button
                className="w-full text-left p-4 flex justify-between items-center focus:outline-none hover:bg-blue-800 transition-colors"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-medium">{faq.question}</span>
                <svg
                  className={`w-6 h-6 transform transition-transform ${openIndex === index ? "rotate-180" : ""}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {openIndex === index && (
                <div className="p-4 pt-0 border-t border-blue-600">
                  <p className="text-blue-100">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="mb-4">Still have questions?</p>
          <button className="px-6 py-2 bg-white text-blue-700 font-medium rounded-full hover:bg-blue-100 transition-colors">
            Contact Us
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
