import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import { Users, Trash2 } from "lucide-react";

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
        <div className="mt-3 flex gap-2 justify-end">
          <button
            className="px-3 py-1 bg-gray-200 rounded text-gray-700 text-xs font-medium hover:bg-gray-300 transition-all"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1 bg-red-500 text-white rounded text-xs font-semibold hover:bg-red-600 transition-all shadow-sm"
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await axiosInstance.delete(
                  `/projects/${projectId}/members/${userId}`
                );
                toast.success("Member removed");
                fetchMembers();
              } catch (err) {
                toast.error(
                  err.response?.data?.error || "Failed to remove member"
                );
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
    return (
      <div className="text-center text-gray-400 mt-20">No project selected</div>
    );
  }
  if (loading) {
    return (
      <div className="text-center text-gray-400 mt-20">Loading members...</div>
    );
  }
  if (error) {
    return <div className="text-center text-red-400 mt-20">{error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-gradient-to-br from-gray-100 to-white border border-primary rounded-3xl shadow-xl p-10 mt-10">
      <div className="flex items-center justify-center gap-2 mb-8">
        <Users className="w-7 h-7 text-primary" />
        <h2 className="text-3xl font-extrabold text-primary drop-shadow">
          Project Members
        </h2>
      </div>

      <ul className="flex flex-col gap-5">
        {members.map((user, idx) => (
          <li
            key={user._id + (user.isOwner ? "-owner" : "-member") + idx}
            className="flex items-center gap-5 py-4 px-5 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-[1.01]"
          >
            <img
              src={user.profilePic || "/default-avatar.png"}
              alt={user.fullName}
              className="w-14 h-14 rounded-full object-cover border-2 border-primary/30 shadow-sm"
            />

            <div className="flex-1 min-w-0">
              <div className="font-semibold text-lg text-gray-800 truncate">
                {user.fullName}
              </div>
              <div className="text-gray-500 text-sm truncate">{user.email}</div>
            </div>

            {user.isOwner ? (
              <span className="ml-auto px-4 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold shadow-sm border border-yellow-200">
                Owner
              </span>
            ) : (
              authUser &&
              members[0] &&
              authUser._id === members[0]._id && (
                <button
                  className="ml-auto flex items-center gap-1 px-4 py-1 bg-red-500 text-white rounded-full text-xs font-semibold hover:bg-red-600 transition-all shadow-sm border border-red-400"
                  onClick={() => handleRemove(user._id)}
                >
                  <Trash2 size={14} />
                  Remove
                </button>
              )
            )}
          </li>
        ))}
      </ul>

      {members.length === 0 && (
        <div className="text-center text-gray-400 mt-10 italic">
          No members found in this project.
        </div>
      )}
    </div>
  );
};

export default MembersPage;
