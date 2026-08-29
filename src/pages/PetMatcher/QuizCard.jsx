import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const QuizCard = () => (
  <section className="py-16 px-6">
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
        <div className="space-y-3 text-center md:text-left">
          <div className="text-5xl">🐾</div>
          <h2 className="text-3xl font-extrabold">Not sure which pet is right for you?</h2>
          <p className="opacity-90 text-lg max-w-md">
            Take our 2-minute lifestyle quiz and we'll match you with the perfect pet from our shelter!
          </p>
        </div>
        <Link
          to="/pet-matcher"
          className="btn bg-white text-orange-500 hover:bg-orange-50 border-none rounded-full px-10 text-lg font-bold gap-2 whitespace-nowrap shadow-lg"
        >
          Take the Quiz <FaArrowRight />
        </Link>
      </div>
    </div>
  </section>
);

export default QuizCard;
