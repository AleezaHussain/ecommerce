// // components/ui/star-rating.js
// import { Star } from "lucide-react";

// export function StarRating({ rating, maxRating = 5, className = "", reviewCount }) {
//   // Simple class merging function (replaces cn utility)
//   const mergeClasses = (...classes) => {
//     return classes.filter(Boolean).join(' ');
//   };

//   return (
//     <div className="flex items-center">
//       <div className={mergeClasses("flex text-yellow-400", className)}>
//         {[...Array(maxRating)].map((_, i) => (
//           <Star 
//             key={i} 
//             className={mergeClasses(
//               "w-4 h-4 fill-current", 
//               i < Math.floor(rating) 
//                 ? "text-yellow-400" 
//                 : "text-neutral-300"
//             )} 
//           />
//         ))}
//       </div>
//       {reviewCount !== undefined && (
//         <span className="text-sm text-neutral-500 ml-1">({reviewCount})</span>
//       )}
//     </div>
//   );
// }