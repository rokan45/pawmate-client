import { FaHeart, FaShieldAlt, FaSmile, FaHandsHelping } from "react-icons/fa";

const reasons = [
  { icon: <FaHeart className="text-3xl text-red-500" />, title: "Save a Life", desc: "Millions of animals need homes. When you adopt, you save a life and make room for another animal in need." },
  { icon: <FaShieldAlt className="text-3xl text-blue-500" />, title: "Health Checked", desc: "All our pets are vaccinated, microchipped, and health-checked before being listed for adoption." },
  { icon: <FaSmile className="text-3xl text-yellow-500" />, title: "Unconditional Love", desc: "Adopted pets show remarkable gratitude and loyalty. The bond you form will last a lifetime." },
  { icon: <FaHandsHelping className="text-3xl text-green-500" />, title: "Support Community", desc: "Your adoption fee supports our shelter, helping us care for more animals and expand our programs." },
];

const WhyAdopt = () => (
  <section className="py-20 bg-base-200">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-14">
        <h2 className="text-4xl font-bold">Why Adopt a Pet?</h2>
        <p className="mt-3 opacity-60 max-w-lg mx-auto">Adopting a pet changes two lives — yours and the animal's. Here's why adoption is the best choice.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {reasons.map(({ icon, title, desc }) => (
          <div key={title} className="card bg-base-100 shadow p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-center mb-4 p-4 bg-base-200 rounded-full w-16 h-16 items-center mx-auto">{icon}</div>
            <h3 className="text-lg font-bold mb-2">{title}</h3>
            <p className="text-sm opacity-65 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyAdopt;
