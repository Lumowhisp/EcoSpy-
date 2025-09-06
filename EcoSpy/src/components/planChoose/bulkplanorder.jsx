import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const BulkPlanOrder = () => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [weight, setWeight] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (weight < 15) {
      setError("Minimum weight should be 15 kg");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const userRef = doc(db, "users", userId);
      const bulkHistoryRef = collection(userRef, "bulkHistory");

      await addDoc(bulkHistoryRef, {
        date,
        time,
        weight,
        address,
        createdAt: new Date(),
      });

      // Show success animation
      setShowSuccess(true);
      
      // Reset form
      setDate("");
      setTime("");
      setWeight("");
      setAddress("");
      setLoading(false);

      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        navigate("/dashBoard");
      }, 3000);

    } catch (err) {
      console.error("Error placing order:", err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  // Success Animation Overlay
  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-green-500 flex flex-col items-center justify-center z-50 animate-fadeIn">
        {/* Success Icon Animation */}
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

        {/* Success Text */}
        <div className="text-center text-white animate-slideUp">
          <h1 className="text-6xl font-bold mb-4 animate-pulse">
            Pickup Scheduled!
          </h1>
          <p className="text-2xl font-medium opacity-90 mb-8">
            Your bulk waste pickup has been confirmed
          </p>
          
          {/* Loading dots for redirect */}
          <div className="flex items-center justify-center space-x-2">
            <span className="text-lg">Redirecting to dashboard</span>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
            </div>
          </div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-float"></div>
          <div className="absolute top-32 right-16 w-12 h-12 bg-white rounded-full animate-float" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-20 left-20 w-16 h-16 bg-white rounded-full animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-32 right-10 w-8 h-8 bg-white rounded-full animate-float" style={{animationDelay: '1.5s'}}></div>
          <div className="absolute top-1/2 left-1/4 w-6 h-6 bg-white rounded-full animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/3 right-1/3 w-10 h-10 bg-white rounded-full animate-float" style={{animationDelay: '2.5s'}}></div>
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
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
          
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
          
          .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
          .animate-bounceIn { animation: bounceIn 0.8s ease-out; }
          .animate-slideUp { animation: slideUp 0.6s ease-out 0.3s both; }
          .animate-checkmark { animation: checkmark 0.6s ease-in-out 0.5s both; }
          .animate-float { animation: float 3s ease-in-out infinite; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
          Bulk Waste Pickup
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="number"
            placeholder="Approx. weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <textarea
            placeholder="Pickup Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md p-2 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {error && (
            <p className="text-red-600 text-sm font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              "Place Pickup"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BulkPlanOrder;