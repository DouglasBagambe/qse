/* eslint-disable react/no-unescaped-entities */
// Newsletter Section Component
import React, { useState } from "react";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Here you would typically make an API call to your subscribe endpoint
      console.log("Subscribed with:", email);
      setIsSubscribed(true);
      setEmail("");
      // Reset subscription status after a few seconds for demo purposes
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-white p-8 overflow-hidden">
          {/* Main Content Container */}
          <div className="flex flex-col max-w-5xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">
                Stay Charged. Stay Informed.
              </h2>
              <p className="text-lg max-w-2xl mx-auto">
                Subscribe to our newsletter for the latest updates on
                QuantumSEC, token sales, and partnerships.
              </p>
            </div>

            {/* Subscription Form */}
            <div className="w-full max-w-md mx-auto mb-8">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-4"
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-3 rounded-lg flex-grow text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                >
                  Subscribe
                </button>
              </form>

              {isSubscribed && (
                <div className="text-green-400 text-center mt-4">
                  Thank you for subscribing!
                </div>
              )}

              <p className="text-sm text-blue-300 text-center mt-4">
                I agree to receive emails from HCISS LLC BSECAEnergy and
                acknowledge that my information will be processed in accordance
                with HCISS LLC BSECAEnergy's Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
