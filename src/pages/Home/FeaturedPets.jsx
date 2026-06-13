import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../utils/axiosSecure";
import { Link } from "react-router-dom";
import { FaPaw } from "react-icons/fa";
import PetCard from "../../components/shared/PetCard";

const FeaturedPets = () => {
  const { data: pets = [], isLoading } = useQuery({
    queryKey: ["featuredPets"],
    queryFn: async () => {
      const res = await axiosSecure.get("/pets/featured");
      return res.data;
    },
  });

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 text-orange-500 mb-3">
          <FaPaw /> <span className="font-semibold uppercase tracking-widest text-sm">Meet Our Pets</span>
        </div>
        <h2 className="text-4xl font-bold">Featured Pets</h2>
        <p className="mt-3 opacity-60 max-w-md mx-auto">These wonderful animals are looking for their forever homes. Could you be the one?</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center"><span className="loading loading-spinner loading-lg text-orange-500"></span></div>
      ) : pets.length === 0 ? (
        <div className="text-center py-20 opacity-50">
          <FaPaw className="text-6xl mx-auto mb-4" />
          <p className="text-xl">No pets available yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {pets.map((pet) => <PetCard key={pet._id} pet={pet} />)}
        </div>
      )}

      <div className="text-center mt-12">
        <Link to="/all-pets" className="btn bg-orange-500 hover:bg-orange-600 text-white border-none rounded-full px-10">
          View All Pets
        </Link>
      </div>
    </section>
  );
};

export default FeaturedPets;
