import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

const MembersPage = ({ projectId }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const authUser = useAuthStore((state) => state.authUser);

  const fetchMembers = () => {
    if (!projectId) return;
    setLoading(true);
    axiosInstance
      .get(`/projects/${projectId}/members`)
      .then((res) => {
        setMembers(res.data);
        setError(null);
      })
      .catch((err) => {
        setError(
          err.response?.data?.error || "Failed to fetch project members"
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMembers();
  }, [projectId]);

  const handleRemove = async (userId) => {
    toast((t) => (
      <span>
        Are you sure you want to remove this member?
        <div className="mt-2 flex gap-2 justify-end">
          <button
            className="px-3 py-1 bg-gray-200 rounded text-gray-700 text-xs"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1 bg-red-500 text-white rounded text-xs"
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await axiosInstance.delete(`/projects/${projectId}/members/${userId}`);
                toast.success("Member removed");
                fetchMembers();
              } catch (err) {
                toast.error(err.response?.data?.error || "Failed to remove member");
              }
            }}
          >
            Remove
          </button>
        </div>
      </span>
    ));
  };

  if (!projectId) {
    return <div className="text-center text-gray-400 mt-20">No project selected</div>;
  }
  if (loading) {
    return <div className="text-center text-gray-400 mt-20">Loading members...</div>;
  }
  if (error) {
    return <div className="text-center text-red-400 mt-20">{error}</div>;
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-8 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-700 text-center">Project Members</h2>
      <ul className="divide-y divide-gray-200">
        {members.map((user, idx) => (
          <li key={user._id + (user.isOwner ? "-owner" : "-member") + idx} className="flex items-center gap-4 py-4">
            <img
              src={user.profilePic || "/default-avatar.png"}
              alt={user.fullName}
              className="w-12 h-12 rounded-full object-cover border"
            />
            <div>
              <div className="font-semibold text-gray-800">{user.fullName}</div>
              <div className="text-gray-500 text-sm">{user.email}</div>
            </div>
            {user.isOwner && (
              <span className="ml-auto px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Owner</span>
            )}
            {!user.isOwner && members[0] && authUser && authUser._id === members[0]._id && (
              <button
                className="ml-auto px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium hover:bg-red-200 transition"
                onClick={() => handleRemove(user._id)}
              >
                Remove
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MembersPage;
