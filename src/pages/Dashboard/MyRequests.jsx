import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import axiosSecure from "../../utils/axiosSecure";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { FaEye, FaTrash, FaInbox } from "react-icons/fa";

const MyRequests = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["myRequests", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/my-requests?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const { mutate: cancelRequest } = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/requests/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Request cancelled");
      queryClient.invalidateQueries(["myRequests"]);
    },
    onError: () => toast.error("Cancellation failed"),
  });

  const handleCancel = (id) => {
    Swal.fire({
      title: "Cancel Request?",
      text: "Are you sure you want to cancel this adoption request?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Cancel Request",
      cancelButtonText: "Keep it",
    }).then((result) => {
      if (result.isConfirmed) cancelRequest(id);
    });
  };

  const statusBadge = (status) => {
    const map = { pending: "badge-warning", approved: "badge-success", rejected: "badge-error" };
    return `badge ${map[status] || "badge-ghost"} text-white`;
  };

  if (isLoading) return (
    <div className="flex justify-center py-20"><span className="loading loading-spinner loading-lg text-orange-500"></span></div>
  );

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <FaInbox className="text-2xl text-orange-500" />
        <h2 className="text-3xl font-bold">My Requests</h2>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-20 opacity-50">
          <p className="text-5xl mb-4">📭</p>
          <p className="text-xl font-semibold">No adoption requests yet</p>
          <Link to="/all-pets" className="btn bg-orange-500 text-white border-none mt-4">Browse Pets</Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow">
          <table className="table table-zebra w-full">
            <thead className="bg-base-200">
              <tr>
                <th>Pet</th>
                <th>Request Date</th>
                <th>Pickup Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req._id}>
                  <td>
                    <div className="font-semibold">{req.petName}</div>
                  </td>
                  <td className="text-sm opacity-70">
                    {new Date(req.requestDate).toLocaleDateString()}
                  </td>
                  <td className="text-sm">
                    {new Date(req.pickupDate).toLocaleDateString()}
                  </td>
                  <td>
                    <span className={statusBadge(req.status)}>
                      {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <Link to={`/pets/${req.petId}`}
                        className="btn btn-xs btn-outline border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white hover:border-blue-500 gap-1">
                        <FaEye /> View
                      </Link>
                      {req.status === "pending" && (
                        <button onClick={() => handleCancel(req._id)}
                          className="btn btn-xs btn-outline border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 gap-1">
                          <FaTrash /> Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyRequests;
