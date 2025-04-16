// /* eslint-disable @next/next/no-img-element */
// "use client";

// import React from "react";
// import Carousel from "react-multi-carousel";
// import "react-multi-carousel/lib/styles.css";

// interface ResponsiveType {
//   [key: string]: {
//     breakpoint: { max: number; min: number };
//     items: number;
//   };
//   superLargeDesktop: {
//     breakpoint: { max: number; min: number };
//     items: number;
//   };
//   desktop: {
//     breakpoint: { max: number; min: number };
//     items: number;
//   };
//   tablet: {
//     breakpoint: { max: number; min: number };
//     items: number;
//   };
//   mobile: {
//     breakpoint: { max: number; min: number };
//     items: number;
//   };
// }

// const responsive: ResponsiveType = {
//   superLargeDesktop: {
//     breakpoint: { max: 4000, min: 3000 },
//     items: 5,
//   },
//   desktop: {
//     breakpoint: { max: 3000, min: 1024 },
//     items: 3,
//   },
//   tablet: {
//     breakpoint: { max: 1024, min: 464 },
//     items: 2,
//   },
//   mobile: {
//     breakpoint: { max: 464, min: 0 },
//     items: 1,
//   },
// };

// const Team = () => {
//   return (
//     <>
//       <Carousel responsive={responsive}>
//         <div className="grid gap-12 items-center md:grid-cols-3">
//           <div className="space-y-4 text-center">
//             <img
//               className="w-64 h-64 mx-auto object-cover rounded-xl md:w-40 md:h-40 lg:w-64 lg:h-64"
//               src="https://tailus.io/sources/blocks/classic/preview/images/woman1.jpg"
//               alt="woman"
//               loading="lazy"
//               width="640"
//               height="805"
//             />
//             <div>
//               <h4 className="text-2xl">Hentoni Doe</h4>
//               <span className="block text-sm text-gray-500">CEO-Founder</span>
//             </div>
//           </div>
//           <div className="space-y-4 text-center">
//             <img
//               className="w-64 h-64 mx-auto object-cover rounded-xl md:w-40 md:h-40 lg:w-64 lg:h-64"
//               src="https://tailus.io/sources/blocks/classic/preview/images/woman1.jpg"
//               alt="woman"
//               loading="lazy"
//               width="640"
//               height="805"
//             />
//             <div>
//               <h4 className="text-2xl">Hentoni Doe</h4>
//               <span className="block text-sm text-gray-500">CEO-Founder</span>
//             </div>
//           </div>
//           <div className="space-y-4 text-center">
//             <img
//               className="w-64 h-64 mx-auto object-cover rounded-xl md:w-40 md:h-40 lg:w-64 lg:h-64"
//               src="https://tailus.io/sources/blocks/classic/preview/images/woman1.jpg"
//               alt="woman"
//               loading="lazy"
//               width="640"
//               height="805"
//             />
//             <div>
//               <h4 className="text-2xl">Hentoni Doe</h4>
//               <span className="block text-sm text-gray-500">CEO-Founder</span>
//             </div>
//           </div>
//           <div className="space-y-4 text-center">
//             <img
//               className="w-64 h-64 mx-auto object-cover rounded-xl md:w-40 md:h-40 lg:w-64 lg:h-64"
//               src="https://tailus.io/sources/blocks/classic/preview/images/woman1.jpg"
//               alt="woman"
//               loading="lazy"
//               width="640"
//               height="805"
//             />
//             <div>
//               <h4 className="text-2xl">Hentoni Doe</h4>
//               <span className="block text-sm text-gray-500">CEO-Founder</span>
//             </div>
//           </div>
//           <div className="space-y-4 text-center">
//             <img
//               className="w-64 h-64 mx-auto object-cover rounded-xl md:w-40 md:h-40 lg:w-64 lg:h-64"
//               src="https://tailus.io/sources/blocks/classic/preview/images/woman1.jpg"
//               alt="woman"
//               loading="lazy"
//               width="640"
//               height="805"
//             />
//             <div>
//               <h4 className="text-2xl">Hentoni Doe</h4>
//               <span className="block text-sm text-gray-500">CEO-Founder</span>
//             </div>
//           </div>
//           <div className="space-y-4 text-center">
//             <img
//               className="w-64 h-64 mx-auto object-cover rounded-xl md:w-40 md:h-40 lg:w-64 lg:h-64"
//               src="https://tailus.io/sources/blocks/classic/preview/images/woman1.jpg"
//               alt="woman"
//               loading="lazy"
//               width="640"
//               height="805"
//             />
//             <div>
//               <h4 className="text-2xl">Hentoni Doe</h4>
//               <span className="block text-sm text-gray-500">CEO-Founder</span>
//             </div>
//           </div>
//         </div>
//         {/* <div>Item 2</div>
//                 <div>Item 3</div>
//                 <div>Item 4</div> */}
//       </Carousel>
//     </>
//   );
// };

// export default Team;
