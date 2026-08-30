import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../../utils/axiosSecure";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { FaCrown, FaCheck, FaTimes, FaSpinner } from "react-icons/fa";

const PLANS = [
  {
    id: "monthly",
    name: "Monthly",
    price: "৳199",
    duration: "1 Month",
    popular: false,
    features: [
      "Unlimited story posts",
      "Community rating access",
      "Priority support",
    ],
  },
  {
    id: "quarterly",
    name: "Quarterly",
    price: "৳499",
    duration: "3 Months",
    popular: true,
    features: [
      "Unlimited story posts",
      "Community rating access",
      "Priority support",
      "Save ৳98 vs monthly",
    ],
  },
  {
    id: "yearly",
    name: "Yearly",
    price: "৳999",
    duration: "1 Year",
    popular: false,
    features: [
      "Unlimited story posts",
      "Community rating access",
      "Priority support",
      "Save ৳1389 vs monthly",
      "Best value!",
    ],
  },
];

const Subscription = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loadingPlan, setLoadingPlan] = useState(null);

  const status = searchParams.get("status");
  const plan = searchParams.get("plan");

  // Show result toast after payment redirect
  useEffect(() => {
    if (status === "success") {
      toast.success(`🎉 Subscription activated! Enjoy unlimited posts!`);
      queryClient.invalidateQueries(["subscriptionStatus"]);
      queryClient.invalidateQueries(["storyCount"]);
    } else if (status === "fail") {
      toast.error("Payment failed. Please try again.");
    } else if (status === "cancel") {
      toast.error("Payment cancelled.");
    }
    if (status) navigate("/subscription", { replace: true });
  }, [status]);

  // Get subscription status
  const { data: subData, isLoading: subLoading } = useQuery({
    queryKey: ["subscriptionStatus"],
    queryFn: async () => {
      const res = await axiosSecure.get("/subscription");
      return res.data;
    },
    enabled: !!user,
  });

  // Initiate payment
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
      toast.error(err.response?.data?.message || "Payment initiation failed");
      setLoadingPlan(null);
    },
  });

  const handleSubscribe = (planId) => {
    if (!user) {
      toast.error("Please login first!");
      navigate("/login");
      return;
    }
    setLoadingPlan(planId);
    initiatePayment(planId);
  };

  const isSubscribed = subData?.subscribed;
  const subscription = subData?.subscription;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero */}
      <div className="text-center py-16 px-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <FaCrown className="text-4xl text-yellow-500" />
        </div>
        <h1 className="text-4xl font-extrabold mb-3">PawMate Premium</h1>
        <p className="text-lg opacity-70 max-w-xl mx-auto">
          Share unlimited adoption stories and inspire thousands of pet lovers.
          Start with 2 free posts, then upgrade to continue!
        </p>

        {/* Current subscription badge */}
        {isSubscribed && subscription && (
          <div className="mt-6 inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-6 py-3 rounded-full font-semibold">
            <FaCheck /> Active Subscription — Expires:{" "}
            {new Date(subscription.expiresAt).toLocaleDateString("en-US", {
              year: "numeric", month: "long", day: "numeric",
            })}
          </div>
        )}
      </div>

      {/* Plans */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        {subLoading ? (
          <div className="flex justify-center py-10">
            <span className="loading loading-spinner loading-lg text-orange-500"></span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((p) => (
              <div
                key={p.id}
                className={`card bg-base-100 shadow-lg relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                  p.popular ? "border-2 border-orange-500" : "border border-base-200"
                }`}
              >
                {/* Popular Badge */}
                {p.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-orange-500 text-white text-center py-1 text-sm font-bold">
                    ⭐ Most Popular
                  </div>
                )}

                <div className={`card-body p-6 ${p.popular ? "pt-10" : ""}`}>
                  <div className="text-center mb-6">
                    <FaCrown
                      className={`text-3xl mx-auto mb-3 ${
                        p.popular ? "text-orange-500" : "text-yellow-500"
                      }`}
                    />
                    <h3 className="text-xl font-bold">{p.name}</h3>
                    <p className="text-4xl font-extrabold text-orange-500 mt-2">
                      {p.price}
                    </p>
                    <p className="text-sm opacity-60 mt-1">{p.duration}</p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <FaCheck className="text-green-500 flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Subscribe Button */}
                  {isSubscribed ? (
                    <button
                      disabled
                      className="btn w-full rounded-full bg-green-500 text-white border-none cursor-not-allowed"
                    >
                      <FaCheck /> Already Subscribed
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSubscribe(p.id)}
                      disabled={loadingPlan !== null}
                      className={`btn w-full rounded-full border-none text-white ${
                        p.popular
                          ? "bg-orange-500 hover:bg-orange-600"
                          : "bg-gray-700 hover:bg-gray-800"
                      }`}
                    >
                      {loadingPlan === p.id ? (
                        <><FaSpinner className="animate-spin" /> Processing...</>
                      ) : (
                        `Subscribe — ${p.price}`
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Free plan info */}
        <div className="mt-10 bg-base-100 rounded-2xl p-6 shadow text-center border border-base-200">
          <h3 className="font-bold text-lg mb-2">Free Plan</h3>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="flex items-center gap-1 text-green-600">
              <FaCheck /> 2 Story Posts
            </span>
            <span className="flex items-center gap-1 text-green-600">
              <FaCheck /> Browse All Pets
            </span>
            <span className="flex items-center gap-1 text-green-600">
              <FaCheck /> Adoption Requests
            </span>
            <span className="flex items-center gap-1 opacity-50">
              <FaTimes /> Unlimited Posts
            </span>
          </div>
        </div>

        {/* SSL Commerz badge */}
        <p className="text-center mt-6 text-sm opacity-40">
          🔒 Secured by SSLCommerz — Bangladesh's trusted payment gateway
        </p>
      </div>
    </div>
  );
};

export default Subscription;
