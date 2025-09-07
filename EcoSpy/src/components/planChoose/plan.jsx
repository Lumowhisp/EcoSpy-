import { Link } from "react-router-dom";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

function PlanChoosing() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [address, setAddress] = useState("");
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const navigate = useNavigate();

  const handleRegularPlan = async () => {
    if (!address) {
      setShowAddressPopup(true);
      return;
    }
    await submitAddress();
  };

  const submitAddress = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, { plan: "Regular", address: address });
      setShowSuccess(true);
      setShowAddressPopup(false);
      setTimeout(() => navigate("/dashBoard"), 3000);
    }
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-green-500 flex flex-col items-center justify-center z-50 animate-fadeIn">
        <div className="mb-8 animate-bounceIn">
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl">
            <svg
              className="w-20 h-20 text-green-500 animate-checkmark"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <div className="text-center text-white animate-slideUp">
          <h1 className="text-6xl font-bold mb-4 animate-pulse">
            Daily Wins Claimed!
          </h1>
          <p className="text-2xl font-medium opacity-90 mb-8">
            Your regular plan pickup has been confirmed
          </p>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-lg">Redirecting to dashboard</span>
            <div className="flex space-x-1">
              <div
                className="w-2 h-2 bg-white rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-white rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-white rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          @keyframes bounceIn {
            0% {
              opacity: 0;
              transform: scale(0.3) translateY(-50px);
            }
            50% {
              opacity: 1;
              transform: scale(1.1) translateY(0);
            }
            100% {
              transform: scale(1) translateY(0);
            }
          }
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes checkmark {
            0% {
              stroke-dasharray: 0 50;
              stroke-dashoffset: 0;
            }
            100% {
              stroke-dasharray: 50 50;
              stroke-dashoffset: -50;
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out;
          }
          .animate-bounceIn {
            animation: bounceIn 0.8s ease-out;
          }
          .animate-slideUp {
            animation: slideUp 0.6s ease-out 0.3s both;
          }
          .animate-checkmark {
            animation: checkmark 0.6s ease-in-out 0.5s both;
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          .animate-fadeInUp {
            animation: fadeInUp 0.3s ease-out forwards;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-300 text-green-600">
      <header>
        <div className="flex justify-between items-center h-17 w-full">
          <div className="flex">
            <Link to="/">
              <img
                className="max-h-32 w-auto pl-4 pt-6"
                src="/media/logoecospyBackgroundRemoved.png"
                alt="Logo-Ecospy"
              />
            </Link>
            <p className="text-green-800 font-semibold  text-5xl mt-9">
              Eco<span className="text-green-600">Spy</span>
            </p>
          </div>
          <div>
            <ul className="flex space-x-5 pr-9 text-green-900 text-lg">
              <li>About Us</li>
              <li>Logout</li>
              <li>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-8"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
              </li>
            </ul>
          </div>
        </div>
      </header>
      <div className="flex-1">
        <hero>
          <div className="flex h-[70vh] justify-center items-center bg-green-500 mt-8 mx-20 rounded-4xl space-x-4">
            <div className="bg-green-200 rounded-2xl pl-3 pr-3 hover:scale-105 transform transition duration-400 hover:shadow-green-900 hover:shadow-xl">
              <h2 class="pt-4 pl-2">
                <span class="font-bold text-green-900 sm:text-3xl sm:pl-2">
                  Regular Plan
                </span>
                –
                <span class="font-semibold text-green-700 sm:text-2xl">
                  “Daily Eco Wins”
                </span>
              </h2>

              <ul className="list-disc pl-5 mt-4 space-y-1 text-lg">
                <li>
                  <span className="font-mplus-rounded">Pickup:</span>{" "}
                  <span className="font-playfair-display text-emerald-900">
                    Scheduled, routine
                  </span>
                </li>
                <li>
                  <span className="font-mplus-rounded">Track Waste: </span>
                  <span className="font-playfair-display text-emerald-900">
                    See contribution
                  </span>
                </li>
                <li>
                  <span className="font-mplus-rounded">Rewards: </span>
                  <span className="font-playfair-display text-emerald-900">
                    Recyclables → Instant cash
                  </span>
                </li>
                <li>
                  <span className="font-mplus-rounded">Impact:</span>
                  <span className="font-playfair-display text-emerald-900">
                    Eco-score rise
                  </span>
                </li>
                <li>
                  <span className="font-mplus-rounded">Easy:</span>
                  <span className="font-playfair-display text-emerald-900">
                    Set once, auto handled
                  </span>
                </li>
                <li>
                  <span className="font-mplus-rounded">Biogas Perks:</span>{" "}
                  <span className="font-playfair-display text-emerald-900">
                    Contribute & save
                  </span>{" "}
                </li>
              </ul>
              <div className="flex items-center justify-center">
                <button
                  type="button"
                  onClick={handleRegularPlan}
                 className="px-5 py-3 bg-green-700 text-gray-200 rounded mt-5 mb-5 hover:bg-green-500 hover:text-green-950 transform transition duration-1000"
                >
                  Claim Daily Wins
                </button>
              </div>
            </div>
            <div className="bg-green-200 rounded-2xl pr-8 pl-6 hover:scale-105 transform transition duration-400 hover:shadow-green-900 hover:shadow-xl">
              <h2 className="pt-4 pl-2">
                <span className="font-bold text-green-900 sm:text-3xl sm:pl-2">
                  Bulk Plan
                </span>
                &ndash;
                <span className="font-semibold text-green-700 sm:text-2xl">
                  “Mega Eco Flex”
                </span>
              </h2>
              <ul className="list-disc pl-5 text-lg mt-4 space-y-1">
                <li>
                  <span className="font-mplus-rounded text-green">
                    Flexible Pickup:
                  </span>{" "}
                  <span className="font-playfair-display text-emerald-900">
                    Choose time
                  </span>
                </li>
                <li>
                  <span className="font-mplus-rounded">Minimum Waste:</span>{" "}
                  <span className="font-playfair-display text-emerald-900">
                    Only big contributions
                  </span>
                </li>
                <li>
                  <span className="font-mplus-rounded">Rewards:</span>{" "}
                  <span className="font-playfair-display text-emerald-900">
                    Recyclables → Instant cash
                  </span>
                </li>
                <li>
                  <span className="font-mplus-rounded">Track & Flex:</span>{" "}
                  <span className="font-playfair-display text-emerald-900">
                    Eco-score grow
                  </span>
                </li>
                <li>
                  <span className="font-mplus-rounded">Hassle-Free:</span>{" "}
                  <span className="font-playfair-display text-emerald-900">
                    Company handles grind
                  </span>
                </li>
                <li>
                  <span className="font-mplus-rounded">Biogas Perks:</span>{" "}
                  <span className="font-playfair-display text-emerald-900">
                    Contribute & save
                  </span>
                </li>
              </ul>
              <div className="flex items-center justify-center">
                <a
                  href="/bulkplanorder"
                  type="button"
                  className="px-5 py-3 bg-green-700 text-gray-200 rounded mt-5 mb-5  hover:bg-green-500 hover:text-green-950 transform transition duration-1000"
                >
                  Unleash Mega Flex
                </a>
              </div>
            </div>
          </div>
        </hero>
      </div>
      {showAddressPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl transform transition-all scale-95 animate-fadeInUp">
            <h2 className="text-xl font-bold mb-4 text-green-800">Enter your Address</h2>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your address"
              className="w-full px-4 py-2 border border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowAddressPopup(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={submitAddress}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      <footer className="mt-auto flex items-center justify-center text-green-900 p-4">
        <p>&copy; 2025 EcoSpy. All rights reserved.</p>
      </footer>
    </div>
  );
}
export default PlanChoosing;
