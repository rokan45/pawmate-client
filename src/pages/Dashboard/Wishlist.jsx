import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import axiosSecure from "../../utils/axiosSecure";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { FaHeart, FaTrash, FaEye } from "react-icons/fa";

const Wishlist = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: wishlist = [], isLoading } = useQuery({
    queryKey: ["wishlist", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/wishlist?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const { mutate: removeItem } = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/wishlist/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Removed from wishlist");
      queryClient.invalidateQueries(["wishlist"]);
    },
    onError: () => toast.error("Remove failed"),
  });

  if (isLoading) return (
    <div className="flex justify-center py-20"><span className="loading loading-spinner loading-lg text-orange-500"></span></div>
  );

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <FaHeart className="text-2xl text-red-500" />
        <h2 className="text-3xl font-bold">My Wishlist</h2>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 opacity-50">
          <FaHeart className="text-6xl mx-auto mb-4 text-gray-300" />
          <p className="text-xl font-semibold">Your wishlist is empty</p>
          <p className="text-sm mt-2">Save pets you're interested in adopting</p>
          <Link to="/all-pets" className="btn bg-orange-500 text-white border-none mt-4">Browse Pets</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div key={item._id} className="card bg-base-100 shadow hover:shadow-lg transition-all overflow-hidden">
              <figure className="h-44 overflow-hidden">
                <img src={item.petImage} alt={item.petName} className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = "https://placehold.co/400x300?text=No+Image"; }} />
              </figure>
              <div className="card-body p-4">
                <h3 className="font-bold text-lg">{item.petName}</h3>
                <p className="text-xs opacity-50">Added: {new Date(item.addedAt).toLocaleDateString()}</p>
                <div className="flex gap-2 mt-3">
                  <Link to={`/pets/${item.petId}`}
                    className="btn btn-sm flex-1 bg-orange-500 hover:bg-orange-600 text-white border-none gap-1">
                    <FaEye /> View Pet
                  </Link>
                  <button onClick={() => removeItem(item._id)}
                    className="btn btn-sm btn-outline border-red-400 text-red-400 hover:bg-red-400 hover:text-white hover:border-red-400">
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
