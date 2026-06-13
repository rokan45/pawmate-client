import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { FaGoogle, FaEye, FaEyeSlash, FaPaw } from "react-icons/fa";

const Register = () => {
  const { register, googleLogin, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = (password, confirm) => {
    if (password.length < 6) return "Password must be at least 6 characters";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
    if (password !== confirm) return "Passwords do not match";
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { name, email, photoURL, password, confirm } = e.target;
    const error = validate(password.value, confirm.value);
    if (error) return toast.error(error);
    setLoading(true);
    try {
      await register(email.value, password.value);
      await updateUserProfile(name.value, photoURL.value);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.message.includes("already") ? "Email already in use" : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await googleLogin();
      toast.success("Account created with Google!");
      navigate("/");
    } catch {
      toast.error("Google signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 px-4 py-12">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl p-8">
        <div className="text-center mb-8">
          <FaPaw className="text-5xl text-orange-500 mx-auto mb-3" />
          <h2 className="text-3xl font-bold">Join PawMate</h2>
          <p className="opacity-60 mt-1">Create an account to start your adoption journey</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="form-control">
            <label className="label"><span className="label-text font-medium">Full Name</span></label>
            <input name="name" type="text" placeholder="John Doe" required className="input input-bordered" />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text font-medium">Email</span></label>
            <input name="email" type="email" placeholder="your@email.com" required className="input input-bordered" />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text font-medium">Photo URL</span></label>
            <input name="photoURL" type="url" placeholder="https://example.com/photo.jpg" className="input input-bordered" />
          </div>
          <div className="form-control relative">
            <label className="label"><span className="label-text font-medium">Password</span></label>
            <input name="password" type={showPw ? "text" : "password"} placeholder="Min 6 chars, uppercase & lowercase" required className="input input-bordered pr-12" />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-[3.1rem] text-gray-400">
              {showPw ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text font-medium">Confirm Password</span></label>
            <input name="confirm" type="password" placeholder="Re-enter your password" required className="input input-bordered" />
          </div>
          <button type="submit" disabled={loading}
            className="btn w-full bg-orange-500 hover:bg-orange-600 text-white border-none rounded-full text-lg mt-2">
            {loading ? <span className="loading loading-spinner loading-sm"></span> : "Create Account"}
          </button>
        </form>

        <div className="divider my-4">OR</div>
        <button onClick={handleGoogle}
          className="btn w-full btn-outline border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-800 rounded-full gap-2">
          <FaGoogle className="text-red-500" /> Continue with Google
        </button>
        <p className="text-center mt-6 text-sm opacity-70">
          Already have an account? <Link to="/login" className="text-orange-500 hover:underline font-medium">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
