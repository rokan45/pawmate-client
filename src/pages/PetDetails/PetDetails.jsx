import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../../utils/axiosSecure";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { FaMapMarkerAlt, FaDollarSign, FaHeart, FaSyringe, FaMedkit, FaVenusMars, FaBirthdayCake, FaPaw } from "react-icons/fa";

const PetDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [pickupDate, setPickupDate] = useState("");
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  const { data: pet, isLoading } = useQuery({
    queryKey: ["pet", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/pets/${id}`);
      return res.data;
    },
  });

  const { mutate: submitRequest, isPending } = useMutation({
    mutationFn: async (data) => {
      const res = await axiosSecure.post("/requests", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Adoption request submitted!");
      setShowForm(false);
      setPickupDate("");
      setMessage("");
      queryClient.invalidateQueries(["pet", id]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to submit request");
    },
  });

  const { mutate: addToWishlist } = useMutation({
    mutationFn: async () => {
      const res = await axiosSecure.post("/wishlist", { petId: id, petName: pet.name, petImage: pet.image, userEmail: user.email });
      return res.data;
    },
    onSuccess: () => toast.success("Added to wishlist!"),
    onError: (err) => toast.error(err.response?.data?.message || "Failed to add wishlist"),
  });

  const handleAdopt = (e) => {
    e.preventDefault();
    if (!pickupDate) return toast.error("Please select a pickup date");
    submitRequest({
      petId: id,
      petName: pet.name,
      requesterName: user.displayName,
      requesterEmail: user.email,
      pickupDate,
      message,
    });
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg text-orange-500"></span>
    </div>
  );

  if (!pet) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-xl opacity-50">Pet not found</p>
    </div>
  );

  const isOwner = user?.email === pet.ownerEmail;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Pet Image & Info */}
        <div className="space-y-6">
          <div className="relative rounded-2xl overflow-hidden shadow-lg">
            <img src={pet.image} alt={pet.name} className="w-full h-96 object-cover"
              onError={(e) => { e.target.src = "https://placehold.co/600x400?text=No+Image"; }} />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className={`badge ${pet.status === "adopted" ? "badge-error" : "badge-success"} text-white text-sm px-3 py-2`}>
                {pet.status === "adopted" ? "Adopted" : "Available"}
              </span>
              <span className="badge badge-warning text-sm px-3 py-2">{pet.species}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: <FaBirthdayCake />, label: "Age", value: `${pet.age} year${pet.age !== 1 ? "s" : ""}` },
              { icon: <FaVenusMars />, label: "Gender", value: pet.gender },
              { icon: <FaMapMarkerAlt />, label: "Location", value: pet.location },
              { icon: <FaDollarSign />, label: "Adoption Fee", value: pet.adoptionFee > 0 ? `$${pet.adoptionFee}` : "Free" },
              { icon: <FaMedkit />, label: "Health", value: pet.healthStatus },
              { icon: <FaSyringe />, label: "Vaccinated", value: pet.vaccinationStatus },
            ].map(({ icon, label, value }) => (
              <div key={label} className="bg-base-200 rounded-xl p-4 flex items-center gap-3">
                <span className="text-orange-500 text-lg">{icon}</span>
                <div>
                  <p className="text-xs opacity-50">{label}</p>
                  <p className="font-semibold text-sm">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Details + Adoption Form */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-1">{pet.name}</h1>
            <p className="text-lg opacity-60">{pet.breed}</p>
          </div>

          <div className="bg-base-200 rounded-xl p-5">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2"> About {pet.name}</h3>
            <p className="opacity-75 leading-relaxed">{pet.description}</p>
          </div>

          {/* Action Buttons */}
          {pet.status === "adopted" ? (
            <div className="alert alert-error">
              <span>This pet has already been adopted. Check out other available pets!</span>
            </div>
          ) : isOwner ? (
            <div className="alert alert-warning">
              <span>You cannot adopt your own pet listing.</span>
            </div>
          ) : (
            <div className="flex gap-3">
              <button onClick={() => setShowForm(!showForm)}
                className="btn flex-1 bg-orange-500 hover:bg-orange-600 text-white border-none rounded-full text-lg">
                {showForm ? "Cancel" : "Adopt Now"}
              </button>
              <button onClick={() => addToWishlist()}
                className="btn btn-outline border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white hover:border-orange-500 rounded-full">
                <FaHeart />
              </button>
            </div>
          )}

          {/* Adoption Form */}
          {showForm && !isOwner && pet.status !== "adopted" && (
            <div className="bg-base-200 rounded-2xl p-6 space-y-4">
              <h3 className="text-xl font-bold">Adoption Request</h3>
              <form onSubmit={handleAdopt} className="space-y-4">
                <div className="form-control">
                  <label className="label"><span className="label-text">Pet Name</span></label>
                  <input type="text" value={pet.name} readOnly className="input input-bordered bg-base-300" />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Your Name</span></label>
                  <input type="text" value={user.displayName} readOnly className="input input-bordered bg-base-300" />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Your Email</span></label>
                  <input type="email" value={user.email} readOnly className="input input-bordered bg-base-300" />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Pickup Date *</span></label>
                  <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]} required className="input input-bordered" />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Message (optional)</span></label>
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)}
                    rows={3} placeholder="Tell us about your home and why you'd like to adopt..." className="textarea textarea-bordered resize-none" />
                </div>
                <button type="submit" disabled={isPending}
                  className="btn w-full bg-orange-500 hover:bg-orange-600 text-white border-none rounded-full">
                  {isPending ? <span className="loading loading-spinner loading-sm"></span> : "Submit Adoption Request"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PetDetails;
