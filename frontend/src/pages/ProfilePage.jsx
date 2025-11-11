import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
  Camera,
  Mail,
  User,
  CalendarDays,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Background from "../components/Background";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center pt-48 px-4 overflow-hidden">
      {/* ✅ Thêm Background động */}
      <Background />

      {/* ✅ Nội dung chính nằm trên nền */}
      <div className="relative z-10 max-w-5xl w-full flex flex-col lg:flex-row gap-8 bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
        {/* LEFT SIDE — Avatar + Basic Info */}
        <div className="flex flex-col items-center lg:w-1/3 border-r border-gray-200 pr-6 space-y-6">
          <div className="relative group">
            <img
              src={selectedImg || authUser.profilePic || "/avatar.png"}
              alt="Profile"
              className="w-40 h-40 rounded-full object-cover border-4 border-gray-300 shadow-lg transition-all duration-300 group-hover:scale-105"
            />
            <label
              htmlFor="avatar-upload"
              className={`absolute bottom-2 right-2 bg-gray-900 hover:bg-gray-800 text-white p-3 rounded-full cursor-pointer shadow-md transition-all duration-200 ${
                isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
              }`}
            >
              <Camera className="w-5 h-5" />
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUpdatingProfile}
              />
            </label>
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-extrabold text-gray-800">
              {authUser?.fullName}
            </h1>
            <p className="text-gray-500">{authUser?.email}</p>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 bg-gray-100 rounded-full px-4 py-1 font-medium">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            Verified Account
          </div>

          <p className="text-gray-400 text-sm italic">
            {isUpdatingProfile
              ? "Uploading new profile photo..."
              : "Click the camera icon to change avatar"}
          </p>
        </div>

        {/* RIGHT SIDE — Info Sections */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Section 1 — About */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-700">
                Profile Details
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                  Full Name
                </p>
                <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 font-medium">
                  {authUser?.fullName}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                  Email
                </p>
                <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 font-medium">
                  {authUser?.email}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2 — Account */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-700">
                Account Information
              </h2>
            </div>
            <div className="divide-y divide-gray-200 text-sm">
              <div className="flex justify-between py-2">
                <span className="text-gray-500 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" /> Member Since
                </span>
                <span className="font-medium text-gray-800">
                  {authUser.createdAt?.split("T")[0]}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Account Status
                </span>
                <span className="font-medium text-green-600">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
