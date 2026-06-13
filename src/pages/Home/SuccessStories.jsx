const stories = [
  { name: "Max & The Johnson Family", img: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=300&q=80", text: "We adopted Max 2 years ago and he has completely transformed our family. He brings so much joy every single day!", pet: "Golden Retriever" },
  { name: "Luna & Sarah", img: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&q=80", text: "Luna was shy at first but now she's the queen of our home. Best decision I ever made was adopting from PawMate.", pet: "Persian Cat" },
  { name: "Tweety & The Kids", img: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=300&q=80", text: "Our kids absolutely love Tweety. He sings every morning and it's become our family's favorite alarm clock!", pet: "Canary Bird" },
];

const SuccessStories = () => (
  <section className="py-20 px-6 max-w-7xl mx-auto">
    <div className="text-center mb-14">
      <h2 className="text-4xl font-bold">Success Stories</h2>
      <p className="mt-3 opacity-60 max-w-lg mx-auto">Hear from families who found their perfect companions through PawMate.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {stories.map(({ name, img, text, pet }) => (
        <div key={name} className="card bg-base-100 shadow-md p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-4 mb-4">
            <img src={img} alt={name} className="w-16 h-16 rounded-full object-cover" />
            <div>
              <h4 className="font-bold">{name}</h4>
              <span className="badge badge-warning badge-sm">{pet}</span>
            </div>
          </div>
          <p className="italic opacity-75 text-sm leading-relaxed">"{text}"</p>
          <div className="flex gap-1 mt-4">
            {"★★★★★".split("").map((s, i) => <span key={i} className="text-yellow-400">{s}</span>)}
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default SuccessStories;
