import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axiosSecure from "../../utils/axiosSecure";
import { FaCrown, FaTimes, FaCheck, FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";

const PLANS = [
  { id: "monthly", name: "Monthly", price: "৳199" },
  { id: "quarterly", name: "Quarterly", price: "৳499", popular: true },
  { id: "yearly", name: "Yearly", price: "৳999" },
];

const SubscriptionModal = ({ onClose }) => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("quarterly");
  const [loadingPlan, setLoadingPlan] = useState(null);

  const { mutate: initiatePayment } = useMutation({
    mutationFn: async (planId) => {
      const res = await axiosSecure.post("/subscription/init", { plan: planId });
      return res.data;
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Payment failed");
      setLoadingPlan(null);
    },
  });

  const handleUpgrade = () => {
    setLoadingPlan(selectedPlan);
    initiatePayment(selectedPlan);
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md text-center">
        <button
          onClick={onClose}
          className="btn btn-ghost btn-sm btn-circle absolute right-4 top-4"
        >
          <FaTimes />
        </button>

        <FaCrown className="text-6xl text-yellow-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">Free Limit Reached!</h3>
        <p className="opacity-70 mb-6">
          You've used your <strong>2 free pet listings</strong>. Upgrade to
          PawMate Premium to add unlimited pets!
        </p>

        {/* Plan Selection */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {PLANS.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPlan(p.id)}
              className={`rounded-xl p-3 text-center border-2 transition-all cursor-pointer ${
                selectedPlan === p.id
                  ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                  : "border-base-300 hover:border-orange-300"
              }`}
            >
              <p className="text-xs font-medium opacity-70">{p.name}</p>
              <p className="font-bold text-orange-500">{p.price}</p>
              {p.popular && (
                <span className="text-xs text-orange-500 font-semibold">Best</span>
              )}
            </button>
          ))}
        </div>

        {/* Selected plan info */}
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-3 mb-5 text-sm">
          Selected: <strong className="text-orange-500">
            {PLANS.find(p => p.id === selectedPlan)?.name} — {PLANS.find(p => p.id === selectedPlan)?.price}
          </strong>
        </div>

        <div className="space-y-2 text-sm text-left mb-6">
          {[
            "Unlimited pet listings",
            "Unlimited story posts",
            "Priority support",
          ].map((f) => (
            <div key={f} className="flex items-center gap-2">
              <FaCheck className="text-green-500 flex-shrink-0" />
              <span>{f}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="btn flex-1 btn-ghost rounded-full"
          >
            Later
          </button>
          <button
            onClick={handleUpgrade}
            disabled={loadingPlan !== null}
            className="btn flex-1 bg-orange-500 hover:bg-orange-600 text-white border-none rounded-full gap-2"
          >
            {loadingPlan ? (
              <><FaSpinner className="animate-spin" /> Processing...</>
            ) : (
              <><FaCrown /> Upgrade Now</>
            )}
          </button>
        </div>

        <p className="text-xs opacity-40 mt-4">
          🔒 Secured by SSLCommerz
        </p>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
};

export default SubscriptionModal;
