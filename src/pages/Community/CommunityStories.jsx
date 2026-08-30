import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import axiosSecure from "../../utils/axiosSecure";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  FaHeart,
  FaPaw,
  FaTrash,
  FaPlus,
  FaTimes,
  FaStar,
} from "react-icons/fa";

const PET_TYPES = ["Dog", "Cat", "Bird", "Rabbit", "Fish", "Hamster", "Other"];

const CommunityStories = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    petName: "",
    petType: "Dog",
    story: "",
    image: "",
    rating: 5,
  });

  // Fetch all stories
  const { data: stories = [], isLoading } = useQuery({
    queryKey: ["communityStories"],
    queryFn: async () => {
      const res = await axiosSecure.get("/stories");
      return res.data;
    },
  });

  // Post story
  const { mutate: postStory, isPending } = useMutation({
    mutationFn: async (data) => {
      const res = await axiosSecure.post("/stories", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Story posted successfully!");
      setShowForm(false);
      setForm({ title: "", petName: "", petType: "Dog", story: "", image: "", rating: 5 });
      queryClient.invalidateQueries(["communityStories"]);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to post"),
  });

  // Delete story
  const { mutate: deleteStory } = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/stories/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Story deleted");
      queryClient.invalidateQueries(["communityStories"]);
    },
    onError: () => toast.error("Delete failed"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.petName || !form.story)
      return toast.error("Please fill all required fields");
    postStory({
      ...form,
      authorName: user.displayName,
      authorEmail: user.email,
      authorPhoto: user.photoURL || "https://i.ibb.co/dcHJxbX/user.png",
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete Story?",
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) deleteStory(id);
    });
  };

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero */}
      <div className="bg-gradient-to-br from-orange-500 to-amber-500 text-white py-16 px-6 text-center">
        {/* <FaHeart className="text-5xl mx-auto mb-4 opacity-80" /> */}
        <h1 className="text-4xl font-extrabold mb-3">Community Stories</h1>
        <p className="text-lg opacity-90 max-w-xl mx-auto">
          Real stories from real families who found their perfect companions
          through PawMate. Share your story and inspire others!
        </p>
        {user ? (
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn bg-white text-orange-500 hover:bg-orange-50 border-none rounded-full px-8 mt-6 gap-2 font-bold"
          >
            {showForm ? <><FaTimes /> Cancel</> : <><FaPlus /> Share Your Story</>}
          </button>
        ) : (
          <Link
            to="/login"
            className="btn bg-white text-orange-500 hover:bg-orange-50 border-none rounded-full px-8 mt-6 font-bold"
          >
            Login to Share Your Story
          </Link>
        )}
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Post Form */}
        {showForm && user && (
          <div className="bg-base-200 rounded-2xl p-8 mb-12 shadow-lg">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
               Share Your Adoption Story
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Story Title *</span>
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Give your story a title"
                    required
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Pet's Name (optional)</span>
                  </label>
                  <input
                    type="text"
                    value={form.petName}
                    onChange={(e) => setForm({ ...form, petName: e.target.value })}
                    placeholder="Enter your pet name"
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Pet Type</span>
                  </label>
                  <select
                    value={form.petType}
                    onChange={(e) => setForm({ ...form, petType: e.target.value })}
                    className="select select-bordered"
                  >
                    {PET_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Photo URL (optional)</span>
                  </label>
                  <input
                    type="url"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="Paste a photo url here"
                    className="input input-bordered"
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Your Story *</span>
                </label>
                <textarea
                  value={form.story}
                  onChange={(e) => setForm({ ...form, story: e.target.value })}
                  rows={4}
                  placeholder="Tell us about your adoption experience, anything you like to share"
                  required
                  className="textarea textarea-bordered resize-none"
                />
              </div>

              {/* Rating
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Your Rating</span>
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setForm({ ...form, rating: star })}
                      className={`text-2xl transition-all ${
                        star <= form.rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div> */}

              <button
                type="submit"
                disabled={isPending}
                className="btn bg-orange-500 hover:bg-orange-600 text-white border-none rounded-full px-10"
              >
                {isPending ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Post Story"
                )}
              </button>
            </form>
          </div>
        )}

        {/* Stories Grid */}
        {isLoading ? (
          <div className="flex justify-center py-10">
            <span className="loading loading-spinner loading-lg text-orange-500"></span>
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-20 opacity-50">
            <FaHeart className="text-6xl mx-auto mb-4 text-gray-300" />
            <p className="text-xl font-semibold">No stories yet</p>
            <p className="text-sm mt-2">Be the first to share your adoption story!</p>
          </div>
        ) : (
          <>
            <p className="mb-6 opacity-60 text-sm">{stories.length} stor{stories.length !== 1 ? "ies" : "y"} shared</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {stories.map((story) => (
                <div
                  key={story._id}
                  className="card bg-base-100 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-base-200"
                >
                  {/* Story Image */}
                  {story.image && (
                    <figure className="h-48 overflow-hidden">
                      <img
                        src={story.image}
                        alt={story.petName}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                    </figure>
                  )}

                  <div className="card-body p-6">
                    {/* Author */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={story.authorPhoto}
                          alt={story.authorName}
                          className="w-10 h-10 rounded-full object-cover border-2 border-orange-300"
                          onError={(e) => { e.target.src = "https://i.ibb.co/dcHJxbX/user.png"; }}
                        />
                        <div>
                          <p className="font-semibold text-sm">{story.authorName}</p>
                          <p className="text-xs opacity-50">
                            {new Date(story.createdAt).toLocaleDateString("en-US", {
                              year: "numeric", month: "short", day: "numeric"
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="badge badge-warning badge-sm">{story.petType}</span>
                        {user?.email === story.authorEmail && (
                          <button
                            onClick={() => handleDelete(story._id)}
                            className="btn btn-ghost btn-xs text-red-400 hover:text-red-600"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold mb-1">{story.title}</h3>
                    {/* <p className="text-sm text-orange-500 font-medium mb-2">
                      🐾 {story.petName}
                    </p> */}

                    {/* Story Text */}
                    <p className="text-sm opacity-70 leading-relaxed italic">
                      "{story.story.length > 180
                        ? story.story.slice(0, 180) + "..."
                        : story.story}"
                    </p>

                    {/* Rating */}
                    {/* <div className="flex gap-1 mt-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={star <= story.rating ? "text-yellow-400" : "text-gray-200"}
                        />
                      ))}
                    </div> */}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CommunityStories;
