import { useState } from "react";
import toast from "react-hot-toast";
import { FaPaw } from "react-icons/fa";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Thanks for subscribing! We'll keep you updated.");
    setEmail("");
  };

  return (
    <section className="py-20 bg-orange-500 text-white">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <FaPaw className="text-5xl mx-auto mb-4 opacity-80" />
        <h2 className="text-4xl font-bold mb-4">Stay Updated!</h2>
        <p className="mb-8 opacity-90">Get notified about new pets available for adoption and success stories from our community.</p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address" required
            className="input flex-1 text-gray-800 placeholder-gray-400" />
          <button type="submit" className="btn bg-white text-orange-500 hover:bg-orange-100 border-none font-bold px-8">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSection;
