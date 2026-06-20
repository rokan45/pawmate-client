import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axiosSecure from "../../utils/axiosSecure";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";

const SPECIES = ["Dog", "Cat", "Bird", "Rabbit", "Fish", "Hamster", "Other"];

const AddPet = ({ existingPet, onSuccess }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isEdit = !!existingPet;

  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => {
      if (isEdit) {
        const res = await axiosSecure.put(`/pets/${existingPet._id}`, data);
        return res.data;
      }
      const res = await axiosSecure.post("/pets", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success(isEdit ? "Pet updated successfully!" : "Pet added successfully!");
      if (onSuccess) onSuccess();
      else navigate("/dashboard/my-listings");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Operation failed"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      name: form.name.value,
      species: form.species.value,
      breed: form.breed.value,
      age: Number(form.age.value),
      gender: form.gender.value,
      image: form.image.value,
      healthStatus: form.healthStatus.value,
      vaccinationStatus: form.vaccinationStatus.value,
      location: form.location.value,
      adoptionFee: Number(form.adoptionFee.value),
      description: form.description.value,
      ownerEmail: user.email,
    };
    mutate(data);
  };

  const def = existingPet || {};

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <FaPlus className="text-2xl text-orange-500" />
        <h2 className="text-3xl font-bold">{isEdit ? "Update Pet" : "Add New Pet"}</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-base-100 rounded-2xl shadow p-8 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="form-control">
            <label className="label"><span className="label-text font-medium">Pet Name *</span></label>
            <input name="name" defaultValue={def.name} type="text" placeholder="Buddy" required className="input input-bordered" />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text font-medium">Species *</span></label>
            <select name="species" defaultValue={def.species || "Dog"} required className="select select-bordered">
              {SPECIES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text font-medium">Breed *</span></label>
            <input name="breed" defaultValue={def.breed} type="text" placeholder="Golden Retriever" required className="input input-bordered" />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text font-medium">Age (years) *</span></label>
            <input name="age" defaultValue={def.age} type="number" min="0" max="30" step="0.5" required className="input input-bordered" />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text font-medium">Gender *</span></label>
            <select name="gender" defaultValue={def.gender || "Male"} required className="select select-bordered">
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text font-medium">Adoption Fee ($) *</span></label>
            <input name="adoptionFee" defaultValue={def.adoptionFee || 0} type="number" min="0" required className="input input-bordered" />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text font-medium">Health Status *</span></label>
            <select name="healthStatus" defaultValue={def.healthStatus || "Excellent"} required className="select select-bordered">
              <option>Excellent</option><option>Good</option><option>Fair</option><option>Needs Care</option>
            </select>
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text font-medium">Vaccination Status *</span></label>
            <select name="vaccinationStatus" defaultValue={def.vaccinationStatus || "Vaccinated"} required className="select select-bordered">
              <option>Vaccinated</option><option>Partially Vaccinated</option><option>Not Vaccinated</option>
            </select>
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text font-medium">Location *</span></label>
            <input name="location" defaultValue={def.location} type="text" placeholder="Dhaka,Bangladesh" required className="input input-bordered" />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text font-medium">Owner Email</span></label>
            <input type="email" value={user.email} readOnly className="input input-bordered bg-base-300" />
          </div>
        </div>

        <div className="form-control">
          <label className="label"><span className="label-text font-medium">Image URL *</span></label>
          <input name="image" defaultValue={def.image} type="url" placeholder="https://i.ibb.co/your-image.jpg" required className="input input-bordered" />
          <label className="label"><span className="label-text-alt opacity-60">Upload to imgbb.com or postimage.org first</span></label>
        </div>

        <div className="form-control">
          <label className="label"><span className="label-text font-medium">Description *</span></label>
          <textarea name="description" defaultValue={def.description} rows={4}
            placeholder="Tell potential adopters about this pet's personality, habits, and needs..." required
            className="textarea textarea-bordered resize-none" />
        </div>

        <button type="submit" disabled={isPending}
          className="btn w-full bg-orange-500 hover:bg-orange-600 text-white border-none rounded-full text-lg">
          {isPending ? <span className="loading loading-spinner loading-sm"></span> : (isEdit ? "Update Pet" : "Add Pet")}
        </button>
      </form>
    </div>
  );
};

export default AddPet;
