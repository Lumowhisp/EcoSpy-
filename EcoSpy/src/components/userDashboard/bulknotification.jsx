import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, collection, query, orderBy, limit, getDocs } from "firebase/firestore";

const BulkOrderNotification = () => {
  const [latestOrder, setLatestOrder] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const bulkRef = collection(doc(db, "users", user.uid), "bulkHistory");
          // Get latest order (ordered by createdAt descending)
          const q = query(bulkRef, orderBy("createdAt", "desc"), limit(1));
          const snapshot = await getDocs(q);

          if (!snapshot.empty) {
            setLatestOrder(snapshot.docs[0].data());
          }
        } catch (err) {
          console.error("Error fetching bulk order:", err);
        }
      }
    });
  }, []);

  if (!latestOrder) {
    return null; // Nothing to show if no bulk order scheduled
  }

  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-lg shadow-md w-[90%] mx-auto mt-5">
      <h3 className="text-lg font-bold mb-1">📢 Bulk Pickup Scheduled!</h3>
      <p>
        Your pickup is scheduled on{" "}
        <span className="font-semibold">{latestOrder.date}</span> at{" "}
        <span className="font-semibold">{latestOrder.time}</span>.
      </p>
      <p className="text-sm mt-1">Address: {latestOrder.address}</p>
    </div>
  );
};

export default BulkOrderNotification;