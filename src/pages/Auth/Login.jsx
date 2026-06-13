import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { FaGoogle, FaEye, FaEyeSlash, FaPaw } from "react-icons/fa";

const Login = () => {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message.includes("invalid") || err.message.includes("wrong") ? "Invalid email or password" : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await googleLogin();
      toast.success("Logged in with Google!");
      navigate(from, { replace: true });
    } catch {
      toast.error("Google login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl p-8">
        <div className="text-center mb-8">
          <FaPaw className="text-5xl text-orange-500 mx-auto mb-3" />
          <h2 className="text-3xl font-bold">Welcome Back!</h2>
          <p className="opacity-60 mt-1">Login to continue your pet adoption journey</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="form-control">
            <label className="label"><span className="label-text font-medium">Email</span></label>
            <input name="email" type="email" placeholder="your@email.com" required className="input input-bordered" />
          </div>
          <div className="form-control relative">
            <label className="label"><span className="label-text font-medium">Password</span></label>
            <input name="password" type={showPw ? "text" : "password"} placeholder="••••••••" required className="input input-bordered pr-12" />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-[3.1rem] text-gray-400 hover:text-gray-600">
              {showPw ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button type="submit" disabled={loading}
            className="btn w-full bg-orange-500 hover:bg-orange-600 text-white border-none rounded-full text-lg mt-2">
            {loading ? <span className="loading loading-spinner loading-sm"></span> : "Login"}
          </button>
        </form>

        <div className="divider my-4">OR</div>

        <button onClick={handleGoogle}
          className="btn w-full btn-outline border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-800 rounded-full gap-2">
          <FaGoogle className="text-red-500" /> Continue with Google
        </button>

        <p className="text-center mt-6 text-sm opacity-70">
          Don't have an account? <Link to="/register" className="text-orange-500 hover:underline font-medium">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
