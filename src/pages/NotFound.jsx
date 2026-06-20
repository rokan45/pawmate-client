import { Link } from "react-router-dom";
import { FaPaw } from "react-icons/fa";

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 text-center px-4">
    <div className="space-y-6">
      <div className="text-9xl font-black text-orange-500 opacity-20">404</div>
      <FaPaw className="text-6xl text-orange-500 mx-auto -mt-8 animate-bounce" />
      <h1 className="text-4xl font-bold">Page Not Found</h1>
      <p className="text-lg opacity-60 max-w-md mx-auto">
        Looks like this page wandered off like a curious puppy. Don't worry, we'll help you find your way back!
      </p>
      <Link to="/" className="btn bg-orange-500 hover:bg-orange-600 text-white border-none rounded-full px-10 text-lg">
        🏠 Back to Home
      </Link>
    </div>
  </div>
);

export default NotFound;
