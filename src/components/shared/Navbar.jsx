import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { FaSun, FaMoon, FaPaw } from "react-icons/fa";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully!");
    } catch {
      toast.error("Logout failed");
    }
  };

  const links = (
    <>
      <li><NavLink to="/" end className={({isActive}) => isActive ? "text-orange-500 font-semibold" : ""}>Home</NavLink></li>
      <li><NavLink to="/all-pets" className={({isActive}) => isActive ? "text-orange-500 font-semibold" : ""}>All Pets</NavLink></li>
      {user && (
        <li><NavLink to="/dashboard/my-requests" className={({isActive}) => isActive ? "text-orange-500 font-semibold" : ""}>My Requests</NavLink></li>
      )}
      {user && (
        <li><NavLink to="/dashboard/add-pet" className={({isActive}) => isActive ? "text-orange-500 font-semibold" : ""}>Add Pet</NavLink></li>
      )}
    </>
  );

  return (
    <nav className="navbar bg-base-100 shadow-md sticky top-0 z-50 px-4 lg:px-8">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            {links}
          </ul>
        </div>
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-orange-500">
          <FaPaw className="text-2xl" />
          <span>PawMate</span>
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-1">{links}</ul>
      </div>

      <div className="navbar-end gap-2">
        <button onClick={toggleTheme} className="btn btn-ghost btn-circle">
          {theme === "dark" ? <FaSun className="text-yellow-400 text-lg" /> : <FaMoon className="text-lg" />}
        </button>

        {user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src={user.photoURL || "https://i.ibb.co/dcHJxbX/user.png"} alt="User" />
              </div>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li className="menu-title px-4 py-2 text-sm font-semibold opacity-70">{user.displayName}</li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/dashboard/wishlist">Wishlist</Link></li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
          </div>
        ) : (
          <Link to="/login" className="btn bg-orange-500 hover:bg-orange-600 text-white border-none">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
