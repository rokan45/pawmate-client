import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../utils/axiosSecure";
import PetCard from "../../components/shared/PetCard";
import { FaSearch, FaFilter, FaSortAmountDown } from "react-icons/fa";

const SPECIES = ["all", "Dog", "Cat", "Bird", "Rabbit", "Fish", "Hamster", "Other"];
const SORTS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "age_asc", label: "Age: Youngest First" },
  { value: "age_desc", label: "Age: Oldest First" },
];

const AllPets = () => {
  const [search, setSearch] = useState("");
  const [species, setSpecies] = useState("all");
  const [sort, setSort] = useState("newest");
  const [inputVal, setInputVal] = useState("");

  const { data: pets = [], isLoading } = useQuery({
    queryKey: ["allPets", search, species, sort],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (species !== "all") params.append("species", species);
      if (sort !== "newest") params.append("sort", sort);
      const res = await axiosSecure.get(`/pets?${params}`);
      return res.data;
    },
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(inputVal);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-3">All Pets</h1>
        <p className="opacity-60">Find your perfect companion from our adorable pets collection.</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-base-200 rounded-2xl p-5 mb-10 flex flex-col md:flex-row gap-4 items-center">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 w-full">
          <input value={inputVal} onChange={(e) => setInputVal(e.target.value)}
            type="text" placeholder="Search by pet name..." className="input input-bordered flex-1" />
          <button type="submit" className="btn bg-orange-500 hover:bg-orange-600 text-white border-none">
            <FaSearch />
          </button>
        </form>

        <div className="flex gap-3 flex-wrap w-full md:w-auto">
          <div className="flex items-center gap-2">
            <FaFilter className="text-orange-500" />
            <select value={species} onChange={(e) => setSpecies(e.target.value)} className="select select-bordered">
              {SPECIES.map((s) => <option key={s} value={s}>{s === "all" ? "All Species" : s}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <FaSortAmountDown className="text-orange-500" />
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="select select-bordered">
              {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        {(search || species !== "all") && (
          <button onClick={() => { setSearch(""); setInputVal(""); setSpecies("all"); }}
            className="btn btn-ghost btn-sm text-orange-500">Clear Filters</button>
        )}
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center py-20"><span className="loading loading-spinner loading-lg text-orange-500"></span></div>
      ) : pets.length === 0 ? (
        <div className="text-center py-20 opacity-50">
          <p className="text-5xl mb-4">🐾</p>
          <p className="text-xl font-semibold">No pets found</p>
          <p className="text-sm mt-2">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <p className="mb-6 opacity-60 text-sm">{pets.length} pet{pets.length !== 1 ? "s" : ""} found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pets.map((pet) => <PetCard key={pet._id} pet={pet} />)}
          </div>
        </>
      )}
    </div>
  );
};

export default AllPets;
