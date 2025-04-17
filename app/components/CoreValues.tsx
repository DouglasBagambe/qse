/* eslint-disable @next/next/no-img-element */
import React from "react";

const CoreValues = () => {
  return (
    <section
      className="bg-blue-900 text-white py-16"
      id="value"
      style={{
        backgroundImage:
          "linear-gradient(rgba(30, 58, 138, 0.97), rgba(30, 64, 175, 0.97)), url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzE5NDE4NSIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIj48L3JlY3Q+PC9zdmc+')",
        backgroundSize: "auto",
      }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block bg-blue-800 bg-opacity-50 rounded-full px-4 py-1 text-sm text-blue-200 mb-4">
            HCISS, LLC (BSECAENERGY)
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our Core Values
          </h2>
          <div className="h-1 w-24 bg-blue-500 mx-auto"></div>
        </div>

        {/* Vision Card */}
        <div className="bg-blue-800 bg-opacity-30 rounded-xl overflow-hidden shadow-lg mb-12">
          <div className="flex flex-col md:flex-row">
            {/* Content */}
            <div className="md:w-1/2 p-8">
              <div className="inline-block bg-blue-700 bg-opacity-50 rounded-full px-3 py-1 text-xs text-blue-200 mb-4">
                01
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 uppercase">
                OUR VISION
              </h3>
              <div className="h-1 w-16 bg-blue-500 mb-6"></div>
              <p className="text-blue-100">
                HCISS, LLC (BSECAENERGY) imagines a world where QSE powers a
                safer, greener EV charging scene. By 2028, we want top-notch
                security and sustainability in e-mobility.
              </p>
            </div>
            {/* Image */}
            <div className="md:w-1/2 bg-blue-700 bg-opacity-20 flex items-center justify-center p-6">
              <img
                src="assets/rainbow.gif"
                alt="Our Vision"
                className="max-h-64 md:max-h-80 object-contain"
              />
            </div>
          </div>
        </div>

        {/* Mission Card */}
        <div className="bg-blue-800 bg-opacity-30 rounded-xl overflow-hidden shadow-lg mb-12">
          <div className="flex flex-col md:flex-row-reverse">
            {/* Content */}
            <div className="md:w-1/2 p-8">
              <div className="inline-block bg-blue-700 bg-opacity-50 rounded-full px-3 py-1 text-xs text-blue-200 mb-4">
                02
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 uppercase">
                OUR MISSION
              </h3>
              <div className="h-1 w-16 bg-blue-500 mb-6"></div>
              <p className="text-blue-100">
                Our mission is to speed up EV adoption by delivering advanced
                yet careful AI and Quantum solutions. We respect user data and
                want to support people in many cultures who seek clean energy
                and trust.
              </p>
            </div>
            {/* Image */}
            <div className="md:w-1/2 bg-blue-700 bg-opacity-20 flex items-center justify-center p-6">
              <img
                src="assets/mission1.gif"
                alt="Our Mission"
                className="max-h-64 md:max-h-80 object-contain"
              />
            </div>
          </div>
        </div>

        {/* Promise Card */}
        <div className="bg-blue-800 bg-opacity-30 rounded-xl overflow-hidden shadow-lg">
          <div className="flex flex-col md:flex-row">
            {/* Content */}
            <div className="md:w-1/2 p-8">
              <div className="inline-block bg-blue-700 bg-opacity-50 rounded-full px-3 py-1 text-xs text-blue-200 mb-4">
                03
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Our Promise
              </h3>
              <div className="h-1 w-16 bg-blue-500 mb-6"></div>
              <p className="text-blue-100">
                We promise simple, secure EV charging for all communities, with
                a focus on privacy, real-world pilot tests, mindful tech
                adoption, and a blend of AI and Quantum technology.
              </p>
            </div>
            {/* Image */}
            <div className="md:w-1/2 bg-blue-700 bg-opacity-20 flex items-center justify-center p-6">
              <img
                src="assets/value.gif"
                alt="Our Promise"
                className="max-h-64 md:max-h-80 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoreValues;
