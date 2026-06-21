import { Link } from "react-router-dom";
import { FaArrowRight, FaPaw } from "react-icons/fa";

const Banner = () => (
  <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
    <div className="absolute inset-0 opacity-10">
      {[...Array(12)].map((_, i) => (
        <FaPaw key={i} className="absolute text-orange-400"
          style={{ fontSize: `${Math.random()*30+20}px`, top: `${Math.random()*100}%`, left: `${Math.random()*100}%`, transform: `rotate(${Math.random()*360}deg)` }} />
      ))}
    </div>
    <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div className="space-y-6 z-10">
        <div className="badge badge-warning gap-2 px-4 py-3 text-sm font-medium">
          <FaPaw /> 500+ Pets Waiting for a Home
        </div>
        <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight">
          Find Your <span className="text-orange-500">Perfect</span> <span className="text-orange-500">Furry</span> Companion
        </h1>
        <p className="text-lg opacity-70 max-w-md">
          Every pet deserves a loving home. Browse our shelter pets and give them the forever home they deserve.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link to="/all-pets" className="btn bg-orange-500 hover:bg-orange-600 text-white border-none gap-2 px-8 py-3 rounded-full text-lg">
            Adopt Now <FaArrowRight />
          </Link>
          <Link to="/all-pets" className="btn btn-outline border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white hover:border-orange-500 rounded-full px-8 py-3 text-lg">
            Browse Pets
          </Link>
        </div>
        <div className="flex gap-8 pt-4">
          {[["500+","Pets Available"],["200+","Happy Families"],["50+","Shelters"]].map(([num, label]) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-bold text-orange-500">{num}</p>
              <p className="text-sm opacity-60">{label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="relative z-10 flex justify-center">
        <div className="relative w-80 h-80 lg:w-96 lg:h-96">
          <div className="absolute inset-0 rounded-full bg-orange-200 dark:bg-orange-900 animate-pulse"></div>
          <img src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500&q=80" alt="Happy Dog"
            className="relative rounded-full w-full h-full object-cover border-8 border-white dark:border-gray-700 shadow-2xl" />
        </div>
      </div>
    </div>
  </section>
);

export default Banner;
