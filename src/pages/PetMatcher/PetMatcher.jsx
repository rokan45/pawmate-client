import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import axiosSecure from "../../utils/axiosSecure";
import { FaPaw, FaArrowRight, FaArrowLeft, FaHeart, FaDollarSign, FaMapMarkerAlt } from "react-icons/fa";

const questions = [
  {
    id: "livingSpace",
    question: "What's your living situation?",
    emoji: "🏠",
    options: [
      { label: "Small apartment", value: "small", species: ["Cat", "Bird", "Hamster", "Fish"], ageMax: 10 },
      { label: "Medium house with small yard", value: "medium", species: ["Dog", "Cat", "Rabbit"], ageMax: 10 },
      { label: "Large house with big yard", value: "large", species: ["Dog", "Cat", "Rabbit", "Bird"], ageMax: 10 },
    ],
  },
  {
    id: "activityLevel",
    question: "How active are you?",
    emoji: "🏃",
    options: [
      { label: "Low — I prefer relaxing at home", value: "low", species: ["Cat", "Fish", "Hamster", "Bird"], ageMin: 3 },
      { label: "Medium — I go for walks daily", value: "medium", species: ["Dog", "Cat", "Rabbit"], ageMax: 7 },
      { label: "High — I love outdoor activities", value: "high", species: ["Dog"], ageMax: 4 },
    ],
  },
  {
    id: "experience",
    question: "What's your pet ownership experience?",
    emoji: "⭐",
    options: [
      { label: "First-time owner", value: "beginner", species: ["Cat", "Fish", "Hamster"], ageMin: 1 },
      { label: "Some experience", value: "intermediate", species: ["Dog", "Cat", "Bird", "Rabbit"], ageMax: 8 },
      { label: "Experienced owner", value: "expert", species: ["Dog", "Cat", "Bird", "Rabbit", "Hamster", "Fish"], ageMax: 10 },
    ],
  },
  {
    id: "kids",
    question: "Do you have children or other pets?",
    emoji: "👨‍👩‍👧",
    options: [
      { label: "Yes, young children (under 10)", value: "young_kids", species: ["Dog", "Cat", "Rabbit"], ageMin: 1, ageMax: 6 },
      { label: "Yes, older children or other pets", value: "older_kids", species: ["Dog", "Cat", "Bird", "Rabbit"], ageMax: 8 },
      { label: "No, just me/adults", value: "none", species: ["Cat", "Fish", "Hamster", "Bird", "Dog", "Rabbit"], ageMax: 10 },
    ],
  },
  {
    id: "timeAvailable",
    question: "How much time can you dedicate daily?",
    emoji: "⏰",
    options: [
      { label: "Less than 1 hour", value: "low", species: ["Fish", "Hamster", "Cat"], ageMin: 2 },
      { label: "1–3 hours", value: "medium", species: ["Cat", "Bird", "Rabbit"], ageMax: 8 },
      { label: "More than 3 hours", value: "high", species: ["Dog", "Cat", "Bird"], ageMax: 5 },
    ],
  },
];

const calculateScore = (pet, answers) => {
  let score = 0;

  // Count how many answers support each species
  const speciesCount = {};

  answers.forEach((answer, index) => {
    const question = questions[index];

    const option = question.options.find(
      (option) => option.value === answer
    );

    if (!option) return;

    option.species.forEach((species) => {
      speciesCount[species] = (speciesCount[species] || 0) + 1;
    });
  });

  // Species match: maximum 40 points
  const totalQuestions = answers.length;
  const speciesMatches = speciesCount[pet.species] || 0;

  score += (speciesMatches / totalQuestions) * 40;

  // Find preferred age range
  let minAge = 0;
  let maxAge = 20;

  answers.forEach((answer, index) => {
    const question = questions[index];

    const option = question.options.find(
      (option) => option.value === answer
    );

    if (!option) return;

    if (option.ageMin !== undefined) {
      minAge = Math.max(minAge, option.ageMin);
    }

    if (option.ageMax !== undefined) {
      maxAge = Math.min(maxAge, option.ageMax);
    }
  });

  // Age match
  const petAge = Number(pet.age);

  if (petAge >= minAge && petAge <= maxAge) {
    score += 30;
  } else if (
    petAge >= minAge - 1 &&
    petAge <= maxAge + 1
  ) {
    score += 15;
  }

  // Available pet gets no penalty
  // Unavailable pet gets a large penalty
  if (pet.status !== "available") {
    score -= 100;
  }

  // Health bonus
  if (pet.healthStatus === "Excellent") {
    score += 15;
  } else if (pet.healthStatus === "Good") {
    score += 10;
  }

  // Vaccination bonus
  if (pet.vaccinationStatus === "Vaccinated") {
    score += 15;
  }

  return score;
};

const PetMatcher = () => {
  const [step, setStep] = useState(0); // 0 = intro, 1-5 = questions, 6 = results
  const [answers, setAnswers] = useState([]);
  const [results, setResults] = useState([]);

  const { data: allPets = [] } = useQuery({
    queryKey: ["allPetsForMatcher"],
    queryFn: async () => {
      const res = await axiosSecure.get("/pets");
      return res.data;
    },
  });

  const handleAnswer = (value) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (step < questions.length) {
      setStep(step + 1);
    }

    if (newAnswers.length === questions.length) {
      // Calculate results
      const scored = allPets
        .map((pet) => ({ ...pet, score: calculateScore(pet, newAnswers) }))
        .filter((pet) => pet.score > 0 && pet.status === "available")
        .sort((a, b) => b.score - a.score)
        .slice(0, 6);
      setResults(scored);
      setStep(questions.length + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setAnswers(answers.slice(0, -1));
      setStep(step - 1);
    }
  };

  const handleRestart = () => {
    setStep(0);
    setAnswers([]);
    setResults([]);
  };

  const progress = step > 0 && step <= questions.length ? (step / questions.length) * 100 : 0;

  // Intro Screen
  if (step === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center space-y-8">
          <div>
            {/* <div className="text-8xl mb-4">🐾</div> */}
            <h1 className="text-4xl font-extrabold mb-3">Pet Matcher Quiz</h1>
            <p className="text-lg opacity-70 leading-relaxed">
              Not sure which pet is right for you? Answer 5 quick questions and we'll find your perfect match from our available pets!
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[["5", "Questions"], ["2", "Minutes"], ["100%", "Free"]].map(([num, label]) => (
              <div key={label} className="bg-base-100 rounded-xl p-4 shadow">
                <p className="text-2xl font-bold text-orange-500">{num}</p>
                <p className="text-sm opacity-60">{label}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => setStep(1)}
            className="btn bg-orange-500 hover:bg-orange-600 text-white border-none rounded-full px-12 text-lg gap-2"
          >
            Start Quiz <FaArrowRight />
          </button>
        </div>
      </div>
    );
  }

  // Results Screen
  if (step === questions.length + 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            {/* <div className="text-6xl mb-4">🎉</div> */}
            <h2 className="text-4xl font-bold mb-3">Your Perfect Matches!</h2>
            <p className="opacity-60 text-lg">
              Based on your lifestyle, here are the best pets for you:
            </p>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-16 bg-base-100 rounded-2xl shadow">
              <p className="text-5xl mb-4">😢</p>
              <p className="text-xl font-semibold">No matching pets found right now</p>
              <p className="opacity-60 mt-2">Check back soon — new pets are added regularly!</p>
              <Link to="/all-pets" className="btn bg-orange-500 text-white border-none mt-6 rounded-full px-8">
                Browse All Pets
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((pet, index) => (
                <div key={pet._id} className="card bg-base-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  {index === 0 && (
                    <div className="bg-orange-500 text-white text-center py-1 text-sm font-bold">
                      ⭐ Best Match!
                    </div>
                  )}
                  <figure className="relative h-48 overflow-hidden">
                    <img
                      src={pet.image}
                      alt={pet.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = "https://placehold.co/400x300?text=No+Image"; }}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="badge badge-warning">{pet.species}</span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="badge bg-orange-500 text-white border-none">
                        {Math.min(Math.round(pet.score), 100)}% match
                      </span>
                    </div>
                  </figure>
                  <div className="card-body p-4">
                    <h3 className="font-bold text-lg">{pet.name}</h3>
                    <p className="text-sm opacity-60">{pet.breed} • {pet.age} yr{pet.age !== 1 ? "s" : ""}</p>
                    <div className="flex items-center gap-3 text-sm opacity-70 mt-1">
                      <span className="flex items-center gap-1"><FaMapMarkerAlt /> {pet.location}</span>
                      <span className="flex items-center gap-1"><FaDollarSign />{pet.adoptionFee > 0 ? pet.adoptionFee : "Free"}</span>
                    </div>
                    <Link
                      to={`/pets/${pet._id}`}
                      className="btn btn-sm mt-3 bg-orange-500 hover:bg-orange-600 text-white border-none rounded-full w-full gap-1"
                    >
                      <FaHeart /> View & Adopt
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-10 flex justify-center gap-4">
            <button
              onClick={handleRestart}
              className="btn btn-outline border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white hover:border-orange-500 rounded-full px-8"
            >
              Retake Quiz
            </button>
            <Link to="/all-pets" className="btn bg-orange-500 hover:bg-orange-600 text-white border-none rounded-full px-8">
              Browse All Pets
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Question Screen
  const currentQuestion = questions[step - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-xl w-full">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm opacity-60 mb-2">
            <span>Question {step} of {questions.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="w-full bg-base-300 rounded-full h-3">
            <div
              className="bg-orange-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-base-100 rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center">
            <div className="text-5xl mb-3">{currentQuestion.emoji}</div>
            <h2 className="text-2xl font-bold">{currentQuestion.question}</h2>
          </div>

          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className="w-full text-left p-4 rounded-xl border-2 border-base-300 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-200 font-medium"
              >
                {option.label}
              </button>
            ))}
          </div>

          {step > 1 && (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-sm opacity-60 hover:opacity-100 hover:text-orange-500 transition-all"
            >
              <FaArrowLeft /> Back to previous question
            </button>
          )}
        </div>

        {/* Step indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all ${i < step ? "bg-orange-500" : "bg-base-300"
                }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PetMatcher;
