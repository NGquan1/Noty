import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import { Users, Trash2, Sparkles, Crown } from "lucide-react";
import RemoteCursor from "../components/RemoteCursor";
import { useChatStore } from "../store/useChatStore";

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

  const { joinProject, leaveProject } = useChatStore();

  useEffect(() => {
    if (projectId) {
      joinProject(projectId);
    }

    return () => {
      if (projectId) {
        leaveProject(projectId);
      }
    };
  }, [projectId, joinProject, leaveProject]);

  const handleRemove = async (userId) => {
    toast((t) => (
      <span className="flex flex-col gap-3 p-2">
        <span className="font-semibold text-gray-800">
          Are you sure you want to remove this member?
        </span>
        <div className="flex gap-2 justify-end">
          <button
            className="px-4 py-2 bg-gray-200 rounded-lg text-gray-700 text-sm font-semibold hover:bg-gray-300 transition-all"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-bold hover:bg-red-600 transition-all shadow-md"
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
    <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-3xl shadow-xl p-10 mt-10 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
        <div className="absolute top-10 right-10 w-32 h-32 bg-violet-200/30 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-indigo-200/20 rounded-full blur-2xl"></div>

        {/* Decorative corners */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-200/20 to-transparent rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-200/20 to-transparent rounded-tr-full"></div>
      </div>

      <div className="flex items-center gap-3 mb-8 relative z-10">
        <div className="p-3 bg-gradient-to-br from-violet-500/10 to-blue-500/10 rounded-2xl backdrop-blur-sm border border-violet-200/30">
          <Users className="w-7 h-7 text-violet-600" />
        </div>
        <div>
          <h2 className="text-4xl font-extrabold text-gray-800">
            Project Members
          </h2>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            {members.length} {members.length === 1 ? "member" : "members"}
          </p>
        </div>
      </div>

      <ul className="flex flex-col gap-4 relative z-10">
        {members.map((user, idx) => (
          <li
            key={user._id + (user.isOwner ? "-owner" : "-member") + idx}
            className="flex items-center gap-5 py-5 px-6 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-gray-200 shadow-md hover:shadow-md transition-all duration-200 hover:scale-[1.02] relative overflow-hidden group"
          >
            {/* Hover gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 to-blue-500/0 transition-all"></div>

            <div className="relative">
              <img
                src={user.profilePic || "/default-avatar.png"}
                alt={user.fullName}
                className="w-16 h-16 rounded-full object-cover border-3 border-gray-200 shadow-md relative z-10"
              />
              {user.isOwner && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center border-2 border-white shadow-md z-20">
                  <Crown className="w-3 h-3 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 relative z-10">
              <div className="font-bold text-lg text-gray-800 truncate flex items-center gap-2">
                {user.fullName}
              </div>
              <div className="text-gray-500 text-sm truncate mt-1">
                {user.email}
              </div>
            </div>

            {user.isOwner ? (
              <span className="ml-auto px-5 py-2 bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 rounded-xl text-sm font-black border-2 border-yellow-200 relative z-10 flex items-center gap-1">
                <Crown className="w-4 h-4" />
                Owner
              </span>
            ) : (
              authUser &&
              members[0] &&
              authUser._id === members[0]._id && (
                <button
                  className="ml-auto flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl text-sm font-bold hover:from-red-600 hover:to-red-700 transition-all  border border-red-400 relative z-10 overflow-hidden group"
                  onClick={() => handleRemove(user._id)}
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0"></div>
                  <Trash2 size={16} className="relative z-10" />
                  <span className="relative z-10">Remove</span>
                </button>
              )
            )}
          </li>
        ))}
      </ul>

      {members.length === 0 && (
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-violet-50/30 rounded-2xl border-2 border-dashed border-gray-200 relative z-10">
          <div className="w-20 h-20 mx-auto mb-4 bg-violet-100 rounded-2xl flex items-center justify-center">
            <Users className="w-10 h-10 text-violet-400" />
          </div>
          <p className="text-gray-600 font-bold text-lg">No members found</p>
          <p className="text-gray-400 text-sm mt-2">
            This project doesn't have any members yet
          </p>
        </div>
      )}

      {/* Remote cursor component - renders when in a project */}
      {projectId && <RemoteCursor projectId={projectId} />}
    </div>
  );
};

export default MembersPage;
