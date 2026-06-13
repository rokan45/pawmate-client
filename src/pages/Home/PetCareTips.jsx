const tips = [
  { emoji: "🦷", title: "Dental Hygiene", desc: "Brush your pet's teeth 2-3 times per week to prevent dental disease and bad breath." },
  { emoji: "🏃", title: "Regular Exercise", desc: "Daily walks and playtime keep pets physically fit and mentally stimulated." },
  { emoji: "🥗", title: "Balanced Diet", desc: "Feed age-appropriate, high-quality food. Avoid human food that may be toxic to pets." },
  { emoji: "🏥", title: "Vet Checkups", desc: "Schedule annual wellness exams and keep vaccinations up to date." },
  { emoji: "🛁", title: "Regular Grooming", desc: "Bathe and groom regularly to maintain coat health and check for parasites." },
  { emoji: "❤️", title: "Show Affection", desc: "Spend quality time with your pet daily. Love and attention are essential for their wellbeing." },
];

const PetCareTips = () => (
  <section className="py-20 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-14">
        <h2 className="text-4xl font-bold">Pet Care Tips</h2>
        <p className="mt-3 opacity-60 max-w-lg mx-auto">Keep your new companion happy and healthy with these essential care guidelines.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tips.map(({ emoji, title, desc }) => (
          <div key={title} className="flex gap-4 bg-base-100 rounded-xl p-5 shadow hover:shadow-md transition-all">
            <span className="text-3xl">{emoji}</span>
            <div>
              <h4 className="font-bold mb-1">{title}</h4>
              <p className="text-sm opacity-65 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default PetCareTips;
