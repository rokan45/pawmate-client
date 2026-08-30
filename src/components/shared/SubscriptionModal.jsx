import { useNavigate } from "react-router-dom";
import { FaCrown, FaTimes, FaCheck } from "react-icons/fa";

const SubscriptionModal = ({ onClose }) => {
  const navigate = useNavigate();

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
          You've used your <strong>2 free story posts</strong>. Upgrade to
          PawMate Premium to share unlimited stories with the community!
        </p>

        {/* Mini plan preview */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {[
            { name: "Monthly", price: "৳199" },
            { name: "Quarterly", price: "৳499", popular: true },
            { name: "Yearly", price: "৳999" },
          ].map((p) => (
            <div
              key={p.name}
              className={`rounded-xl p-3 text-center border-2 ${
                p.popular
                  ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                  : "border-base-300"
              }`}
            >
              <p className="text-xs font-medium opacity-70">{p.name}</p>
              <p className="font-bold text-orange-500">{p.price}</p>
              {p.popular && (
                <span className="text-xs text-orange-500 font-semibold">Best</span>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-2 text-sm text-left mb-6">
          {[
            "Unlimited story posts",
            "Community rating access",
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
            onClick={() => { onClose(); navigate("/subscription"); }}
            className="btn flex-1 bg-orange-500 hover:bg-orange-600 text-white border-none rounded-full gap-2"
          >
            <FaCrown /> Upgrade Now
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
};

export default SubscriptionModal;
