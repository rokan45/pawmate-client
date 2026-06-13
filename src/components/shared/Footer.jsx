import { FaPaw, FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhone } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-base-200 text-base-content">
    <div className="footer p-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-orange-500 mb-4">
          <FaPaw />
          <span>PawMate</span>
        </Link>
        <p className="text-sm opacity-70">Connecting loving hearts with furry friends. Find your perfect pet companion today.</p>
      </div>
      <div>
        <span className="footer-title">Contact</span>
        <div className="flex items-center gap-2 mt-2"><FaEnvelope /> <span>adopt@pawmate.com</span></div>
        <div className="flex items-center gap-2 mt-2"><FaPhone /> <span>+1 (555) 123-4567</span></div>
      </div>
      <div>
        <span className="footer-title">Follow Us</span>
        <div className="flex gap-4 mt-2">
          <a href="#" className="text-2xl hover:text-orange-500 transition-colors"><FaFacebook /></a>
          <a href="#" className="text-2xl hover:text-orange-500 transition-colors"><FaTwitter /></a>
          <a href="#" className="text-2xl hover:text-orange-500 transition-colors"><FaInstagram /></a>
        </div>
      </div>
    </div>
    <div className="border-t border-base-300 text-center py-4 text-sm opacity-60">
      © {new Date().getFullYear()} PawMate. All rights reserved.
    </div>
  </footer>
);

export default Footer;
