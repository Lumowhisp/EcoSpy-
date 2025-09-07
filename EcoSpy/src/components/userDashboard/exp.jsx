import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import WasteHistory from "./wasteHistory";
import WasteTypeChart from "./wasteTypeGraph";
import { collection, getDocs, query, where } from "firebase/firestore";
import BulkOrderNotification from "./bulknotification";

function Exp() {
  const [plan, setPlan] = useState("");
  const [ecopoints, setEcopoints] = useState(0);
  const [wastecollected, setWasteCollected] = useState(0);
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    mobile: "",
    photoURL: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qrCodeURL, setQrCodeURL] = useState("");

  // State for notifications
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const userData = docSnap.data();
            setPlan(userData.plan || "No plan");
            setEcopoints(userData.ecopoints || 0);
            setWasteCollected(userData.wastecollected || 0);
            setProfileData({
              name: userData.name || currentUser.displayName || "",
              email: userData.email || currentUser.email || "",
              mobile: userData.mobile || "",
              photoURL: userData.photoURL || currentUser.photoURL || "",
            });
          }

          // Generate QR code with UID
          generateQRCode(currentUser.uid);

          // Fetch bulkOrders and regularOrders for notifications
          // Assume 'bulkOrders' and 'regularOrders' collections have a userId field
          const bulkOrdersQuery = query(
            collection(db, "bulkOrders"),
            where("userId", "==", currentUser.uid)
          );
          const regularOrdersQuery = query(
            collection(db, "regularOrders"),
            where("userId", "==", currentUser.uid)
          );

          const [bulkSnap, regularSnap] = await Promise.all([
            getDocs(bulkOrdersQuery),
            getDocs(regularOrdersQuery),
          ]);

          const bulkOrders = bulkSnap.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
            type: "Bulk",
          }));
          const regularOrders = regularSnap.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
            type: "Regular",
          }));

          // Merge, sort by createdAt descending, slice first 5
          const merged = [...bulkOrders, ...regularOrders]
            .filter((order) => order.createdAt)
            .sort(
              (a, b) =>
                new Date(
                  b.createdAt.seconds ? b.createdAt.seconds * 1000 : b.createdAt
                ) -
                new Date(
                  a.createdAt.seconds ? a.createdAt.seconds * 1000 : a.createdAt
                )
            )
            .slice(0, 5);
          setNotifications(merged);
        } catch (err) {
          console.error("Error fetching data:", err);
        }
      } else {
        setPlan("Please login");
        setEcopoints(0);
        setWasteCollected(0);
        setQrCodeURL("");
        setNotifications([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const generateQRCode = (uid) => {
    // Using QR Server API for QR code generation
    const qrURL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${uid}&bgcolor=ffffff&color=166534`;
    setQrCodeURL(qrURL);
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  const handleProfileUpdate = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        name: profileData.name,
        email: profileData.email,
        mobile: profileData.mobile,
        photoURL: profileData.photoURL,
        updatedAt: new Date(),
      });

      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile!");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // File size check (max 500KB)
      if (file.size > 500000) {
        alert("File size should be less than 500KB!");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        // Create canvas to compress image
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Set max dimensions
          const maxWidth = 200;
          const maxHeight = 200;

          let { width, height } = img;

          // Calculate new dimensions
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to base64 with quality compression
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.6);

          setProfileData((prev) => ({
            ...prev,
            photoURL: compressedDataUrl,
          }));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-200 to-green-700">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-96 bg-white shadow-2xl transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 bg-green-600 text-white">
            <h2 className="text-xl font-bold">Profile Settings</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-white hover:text-gray-300"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Profile Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                {profileData.photoURL ? (
                  <img
                    src={profileData.photoURL}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-green-500"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center text-white text-3xl font-bold border-4 border-green-600">
                    {getInitials(profileData.name)}
                  </div>
                )}

                {isEditing && (
                  <label className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                    />
                  </label>
                )}
              </div>

              <h3 className="mt-3 text-xl font-semibold text-gray-800">
                {profileData.name || "User"}
              </h3>
            </div>

            {/* Profile Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    isEditing
                      ? "border-green-500 focus:ring-2 focus:ring-green-500"
                      : "border-gray-300 bg-gray-50"
                  } focus:outline-none`}
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    isEditing
                      ? "border-green-500 focus:ring-2 focus:ring-green-500"
                      : "border-gray-300 bg-gray-50"
                  } focus:outline-none`}
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={profileData.mobile}
                  onChange={(e) => handleInputChange("mobile", e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    isEditing
                      ? "border-green-500 focus:ring-2 focus:ring-green-500"
                      : "border-gray-300 bg-gray-50"
                  } focus:outline-none`}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex space-x-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleProfileUpdate}
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-200"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>

            {/* QR Code Section */}
            {qrCodeURL && (
              <div className="mt-8 text-center">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  Your QR Code
                </h4>
                <div className="bg-white p-4 rounded-lg shadow-md inline-block">
                  <img
                    src={qrCodeURL}
                    alt="User QR Code"
                    className="w-48 h-48"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Use this QR code at vending machines
                </p>
                <button
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = qrCodeURL;
                    link.download = `EcoSpy-QR-${user?.uid}.png`;
                    link.click();
                  }}
                  className="mt-3 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
                >
                  Download QR Code
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 backdrop-blur-md bg-opacity-30 z-40"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <div className="flex justify-between items-center h-17 w-full">
          <div className="flex">
            <Link to="/">
              <img
                className="max-h-32 w-auto pl-4 pt-6"
                src="/media/logoecospyBackgroundRemoved.png"
                alt="Logo-Ecospy"
              />
            </Link>
            <p className="text-green-800 font-semibold text-5xl mt-9">
              Eco<span className="text-green-600">Spy</span>
            </p>
          </div>
          <div className="flex items-center space-x-5">
            <ul className="flex space-x-5 pr-5 text-green-900 text-lg">
              <li>
                <a className="hover:underline" href="/aboutus">
                  About Us
                </a>
              </li>
              <li>
                <a className="hover:underline" href="/">
                  Logout
                </a>
              </li>
              <li>
                <a className="hover:underline" href="/contactus">
                  Contact Us
                </a>
              </li>
            </ul>

            {/* Profile Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 mr-6"
            >
              {profileData.photoURL ? (
                <img
                  src={profileData.photoURL}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center text-white text-sm font-bold">
                  {getInitials(profileData.name)}
                </div>
              )}
              <span>Profile</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <div className="pt-28">
        <div>
          <div className="flex justify-center">
            <div className="backdrop-blur-sm bg-white/30 p-6 rounded-xl w-[90vw] hover:backdrop-blur-md hover:bg-amber-500/30 transform transition duration-1000">
              <p>
                <span className="text-4xl font-extrabold text-emerald-900">
                  Hey,
                </span>{" "}
                <br />
                <span className="text-3xl font-bold text-emerald-800 ">
                  {profileData.name || "User"}
                </span>
              </p>
              {/* Stats Cards */}
              <div className="flex justify-between mt-7 mx-20 mb-7">
                <div className="h-[40vh] w-[20vw] bg-green-100 rounded-xl pt-3 hover:scale-110 transform transition duration-500 hover:shadow-2xl hover:shadow-green-900">
                  <h2>
                    <strong>
                      <span className="text-4xl text-green-900 pl-3">
                        Eco Warrior
                      </span>
                    </strong>
                  </h2>
                  <h3>
                    <span className="text-xl text-green-700 pl-3">Status</span>
                  </h3>
                  <div className="flex flex-col justify-center items-center h-52">
                    <div className="flex items-center justify-center bg-green-300 w-2/3 h-1/3 rounded-4xl pb-3 mb-7 ">
                      <p>
                        <span className="text-4xl text-green-900 font-extrabold">
                          {wastecollected ? wastecollected : "0"}
                          <span>kg</span>
                        </span>
                      </p>
                    </div>
                    <div className="font-delius text-xl">
                      <p>Waste Collected</p>
                    </div>
                  </div>
                </div>

                <div className="h-[40vh] w-[20vw] bg-green-100 rounded-xl pt-3 hover:scale-110 transform transition duration-500 hover:shadow-2xl hover:shadow-green-900">
                  <h2>
                    <strong>
                      <span className="text-4xl text-green-900 pl-3">
                        EcoPoints
                      </span>
                    </strong>
                  </h2>
                  <h3>
                    <span className="text-xl text-green-700 pl-3">Earned</span>
                  </h3>
                  <div className="flex flex-col justify-center items-center h-52">
                    <div className="flex items-center justify-center bg-green-300 w-2/3 h-1/3 rounded-4xl pb-2 mb-5 ">
                      <p>
                        <span className="text-4xl font-extrabold text-green-900">
                          {ecopoints ? ecopoints : "0"}
                        </span>
                      </p>
                    </div>
                    <div className="font-delius text-xl">
                      <p>1 EcoPoint &#61; &#8377;0.5</p>
                    </div>
                  </div>
                </div>

                <div className="h-[40vh] w-[20vw] bg-green-100 rounded-xl pt-3 hover:scale-110 transform transition duration-500 hover:shadow-2xl hover:shadow-green-900">
                  <div>
                    <h2>
                      <strong>
                        <span className="text-4xl text-green-900 pl-3 ">
                          Current Plan
                        </span>
                      </strong>
                    </h2>
                    <h3>
                      <span className="text-xl text-green-700 pl-3">
                        EcoWins
                      </span>
                    </h3>
                  </div>
                  <div className="flex flex-col justify-center items-center h-52">
                    <div className="flex items-center justify-center bg-green-300 w-2/3 h-1/3 rounded-4xl pb-2 ">
                      <p>
                        <span className="text-4xl font-playfair-display">
                          {plan ? plan : "...Loading"}
                        </span>
                      </p>
                    </div>
                    <div className="flex space-x-2 mt-7">
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className=" size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                          />
                        </svg>
                      </div>
                      <div className="text-xl font-delius">
                        <p>
                          <a href="/PlanChoosing">Bulk Pickup</a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex mt-5 space-x-3">
            <div className="flex-[0.9] bg-white/40 rounded-xl p-4 shadow-md">
              {/* Recent Orders: Bulk and Regular Notifications */}
              <h2 className="text-xl font-bold mb-3 text-green-900">
                Notifications
              </h2>
              <div className="space-y-3">
                {/* BulkOrderNotification */}
                <BulkOrderNotification />
                {/* Regular orders notification */}
                <div className="bg-white/80 rounded-lg shadow border-l-4 border-green-500 flex items-start p-4 mt-3">
                  <div className="flex-shrink-0">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      Regular
                    </span>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="font-semibold text-gray-800">
                      Regular Plan Pickup
                    </div>
                    <div className="text-sm text-gray-600">
                      Waste to be collected at 9:00 AM
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-[1.1] bg-white/40 rounded-xl p-4 shadow-md">
              <WasteHistory />
            </div>
            <div className="flex-[1.2] bg-white/40 rounded-xl p-4 shadow-md">
              <WasteTypeChart />
            </div>
          </div>
        </div>
        <footer className="flex items-center justify-center text-green-1000 p-4">
          <p>&copy; 2025 EcoSpy. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default Exp;
