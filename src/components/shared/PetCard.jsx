import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaDollarSign, FaBirthdayCake } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const PetCard = ({ pet }) => {
  const { user } = useAuth();
  const { _id, name, species, breed, age, image, location, adoptionFee, status } = pet;

  return (
    <div className="card bg-base-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
      <figure className="relative h-56 overflow-hidden">
        <img src={image} alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => { e.target.src = "https://placehold.co/400x300?text=No+Image"; }} />
        <div className="absolute top-3 right-3">
          <span className={`badge ${status === "adopted" ? "badge-error" : "badge-success"} text-white font-medium`}>
            {status === "adopted" ? "Adopted" : "Available"}
          </span>
        </div>
        <div className="absolute top-3 left-3">
          <span className="badge badge-warning">{species}</span>
        </div>
      </figure>
      <div className="card-body p-5">
        <h3 className="card-title text-xl font-bold">{name}</h3>
        <p className="text-sm opacity-60">{breed}</p>
        <div className="flex flex-wrap gap-3 mt-2 text-sm opacity-70">
          <span className="flex items-center gap-1"><FaBirthdayCake /> {age} yr{age !== 1 ? "s" : ""}</span>
          <span className="flex items-center gap-1"><FaMapMarkerAlt /> {location}</span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="flex items-center gap-1 font-bold text-orange-500 text-lg">
            <FaDollarSign />{adoptionFee > 0 ? adoptionFee : "Free"}
          </span>
          <Link
            to={user ? `/pets/${_id}` : "/login"}
            className="btn btn-sm bg-orange-500 hover:bg-orange-600 text-white border-none rounded-full px-5">
            Show Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PetCard;
