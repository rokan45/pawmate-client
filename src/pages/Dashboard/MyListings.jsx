import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import axiosSecure from "../../utils/axiosSecure";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaEye, FaInbox, FaTimes, FaCheck } from "react-icons/fa";
import AddPet from "./AddPet";

const MyListings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [editPet, setEditPet] = useState(null);
  const [requestsModal, setRequestsModal] = useState(null);

  const { data: pets = [], isLoading } = useQuery({
    queryKey: ["myPets", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/my-pets?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const { data: petRequests = [], isLoading: loadingRequests } = useQuery({
    queryKey: ["petRequests", requestsModal?._id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/requests/pet/${requestsModal._id}`);
      return res.data;
    },
    enabled: !!requestsModal?._id,
  });

  const { mutate: deletePet } = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/pets/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Pet deleted!");
      queryClient.invalidateQueries(["myPets"]);
    },
    onError: () => toast.error("Delete failed"),
  });

  const { mutate: approveRequest } = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.patch(`/requests/${id}/approve`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Request approved!");
      queryClient.invalidateQueries(["petRequests"]);
      queryClient.invalidateQueries(["myPets"]);
    },
    onError: () => toast.error("Approval failed"),
  });

  const { mutate: rejectRequest } = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.patch(`/requests/${id}/reject`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Request rejected");
      queryClient.invalidateQueries(["petRequests"]);
    },
    onError: () => toast.error("Rejection failed"),
  });

  const handleDelete = (id, name) => {
    Swal.fire({
      title: `Delete ${name}?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete",
    }).then((result) => {
      if (result.isConfirmed) deletePet(id);
    });
  };

  const totalListings = pets.length;
  const available = pets.filter((p) => p.status === "available").length;
  const adopted = pets.filter((p) => p.status === "adopted").length;

  if (isLoading) return (
    <div className="flex justify-center py-20"><span className="loading loading-spinner loading-lg text-orange-500"></span></div>
  );

  if (editPet) return (
    <div>
      <button onClick={() => setEditPet(null)} className="btn btn-ghost mb-4 gap-2">← Back to Listings</button>
      <AddPet existingPet={editPet} onSuccess={() => { setEditPet(null); queryClient.invalidateQueries(["myPets"]); }} />
    </div>
  );

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">My Listings</h2>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[["Total", totalListings, "bg-blue-50 text-blue-600 dark:bg-blue-900/20"],
          ["Available", available, "bg-green-50 text-green-600 dark:bg-green-900/20"],
          ["Adopted", adopted, "bg-orange-50 text-orange-600 dark:bg-orange-900/20"]].map(([label, val, cls]) => (
          <div key={label} className={`rounded-xl p-4 text-center ${cls}`}>
            <p className="text-2xl font-bold">{val}</p>
            <p className="text-sm font-medium">{label}</p>
          </div>
        ))}
      </div>

      {pets.length === 0 ? (
        <div className="text-center py-20 opacity-50">
          <p className="text-5xl mb-4">🐾</p>
          <p className="text-xl font-semibold">No pets listed yet</p>
          <Link to="/dashboard/add-pet" className="btn bg-orange-500 text-white border-none mt-4">Add Your First Pet</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <div key={pet._id} className="card bg-base-100 shadow hover:shadow-lg transition-all overflow-hidden">
              <figure className="h-44 overflow-hidden">
                <img src={pet.image} alt={pet.name} className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = "https://placehold.co/400x300?text=No+Image"; }} />
              </figure>
              <div className="card-body p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{pet.name}</h3>
                    <p className="text-sm opacity-60">{pet.species} • {pet.breed}</p>
                  </div>
                  <span className={`badge ${pet.status === "adopted" ? "badge-error" : "badge-success"} text-white`}>
                    {pet.status}
                  </span>
                </div>
                <p className="font-semibold text-orange-500">${pet.adoptionFee || "Free"}</p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <button onClick={() => setRequestsModal(pet)}
                    className="btn btn-xs btn-outline border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white hover:border-blue-500 gap-1">
                    <FaInbox /> Requests
                  </button>
                  <button onClick={() => setEditPet(pet)}
                    className="btn btn-xs btn-outline border-green-500 text-green-500 hover:bg-green-500 hover:text-white hover:border-green-500 gap-1">
                    <FaEdit /> Edit
                  </button>
                  <Link to={`/pets/${pet._id}`}
                    className="btn btn-xs btn-outline border-gray-400 text-gray-500 hover:bg-gray-500 hover:text-white hover:border-gray-500 gap-1">
                    <FaEye /> View
                  </Link>
                  <button onClick={() => handleDelete(pet._id, pet.name)}
                    className="btn btn-xs btn-outline border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 gap-1">
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Requests Modal */}
      {requestsModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Requests for {requestsModal.name}</h3>
              <button onClick={() => setRequestsModal(null)} className="btn btn-ghost btn-circle btn-sm"><FaTimes /></button>
            </div>
            {loadingRequests ? (
              <div className="flex justify-center py-8"><span className="loading loading-spinner text-orange-500"></span></div>
            ) : petRequests.length === 0 ? (
              <p className="text-center opacity-50 py-8">No requests yet for this pet.</p>
            ) : (
              <div className="space-y-4">
                {petRequests.map((req) => (
                  <div key={req._id} className="border border-base-300 rounded-xl p-4">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div>
                        <p className="font-semibold">{req.requesterName}</p>
                        <p className="text-sm opacity-60">{req.requesterEmail}</p>
                        <p className="text-sm mt-1">Pickup: <span className="font-medium">{new Date(req.pickupDate).toLocaleDateString()}</span></p>
                        {req.message && <p className="text-sm opacity-70 mt-1 italic">"{req.message}"</p>}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`badge ${req.status === "approved" ? "badge-success" : req.status === "rejected" ? "badge-error" : "badge-warning"} text-white`}>
                          {req.status}
                        </span>
                        {req.status === "pending" && (
                          <div className="flex gap-2">
                            <button onClick={() => approveRequest(req._id)}
                              className="btn btn-xs bg-green-500 hover:bg-green-600 text-white border-none gap-1">
                              <FaCheck /> Approve
                            </button>
                            <button onClick={() => rejectRequest(req._id)}
                              className="btn btn-xs bg-red-500 hover:bg-red-600 text-white border-none gap-1">
                              <FaTimes /> Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="modal-action">
              <button onClick={() => setRequestsModal(null)} className="btn btn-ghost">Close</button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setRequestsModal(null)}></div>
        </div>
      )}
    </div>
  );
};

export default MyListings;
