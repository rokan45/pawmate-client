import { Outlet, NavLink, Link } from "react-router-dom";
import { FaPaw, FaPlus, FaList, FaHeart, FaInbox } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";
import toast from "react-hot-toast";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out!");
  };

  const navItems = [
    { to: "/dashboard/my-listings", icon: <FaList />, label: "My Listings" },
    { to: "/dashboard/add-pet", icon: <FaPlus />, label: "Add Pet" },
    { to: "/dashboard/my-requests", icon: <FaInbox />, label: "My Requests" },
    { to: "/dashboard/wishlist", icon: <FaHeart />, label: "Wishlist" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="navbar bg-base-100 shadow-md px-4 sticky top-0 z-50">
        <div className="flex-1">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-orange-500">
            <FaPaw /> <span>PawMate</span>
          </Link>
        </div>
        <div className="flex-none gap-2">
          <button onClick={toggleTheme} className="btn btn-ghost btn-circle">
            {theme === "dark" ? <FaSun className="text-yellow-400" /> : <FaMoon />}
          </button>
          <Link to="/" className="btn btn-ghost btn-sm hidden md:flex">Home</Link>
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-9 rounded-full">
                <img src={user?.photoURL || "https://i.ibb.co/dcHJxbX/user.png"} alt="User" />
              </div>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li className="menu-title px-4 py-1 text-xs">{user?.displayName}</li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-base-200 min-h-full hidden md:block p-4">
          <ul className="menu gap-1">
            {navItems.map(({ to, icon, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                      isActive ? "bg-orange-500 text-white" : "hover:bg-base-300"
                    }`
                  }
                >
                  {icon} {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </aside>

        {/* Mobile bottom nav */}
        <div className="btm-nav md:hidden z-50">
          {navItems.map(({ to, icon, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) => isActive ? "active text-orange-500" : ""}>
              {icon}
              <span className="btm-nav-label text-xs">{label}</span>
            </NavLink>
          ))}
        </div>

        {/* Main content */}
        <main className="flex-1 p-6 pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
