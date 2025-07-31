import React, { useEffect, useState } from "react";
import { useProjectStore } from "../store/useProjectStore";
import { Copy } from "lucide-react";
import axios from "axios";

const MemberPage = () => {
  const {
    currentProjectId,
    shareProjectByLink,
    projects,
    fetchProjectMembers,
  } = useProjectStore();

  const [members, setMembers] = useState([]);
  const [shareRole, setShareRole] = useState("editor");
  const [shareLink, setShareLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copySuccess, setCopySuccess] = useState("");

  const project = projects.find(
    (p) => p._id === currentProjectId || p.id === currentProjectId
  );

  useEffect(() => {
    const loadMembers = async () => {
      if (!currentProjectId) return;
      try {
        const res = await axios.get(
          `http://localhost:5001/api/projects/${currentProjectId}/members`,
          { withCredentials: true }
        );
        setMembers(res.data.members);
      } catch (err) {
        console.error("Failed to fetch members", err);
      }
    };
    loadMembers();
  }, [currentProjectId]);

  const handleGenerateShareLink = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await shareProjectByLink(currentProjectId, shareRole);
      setShareLink(`${window.location.origin}/join/${data.token}`);
    } catch (err) {
      setError("Could not generate share link");
    }
    setLoading(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopySuccess("Copied!");
      setTimeout(() => setCopySuccess(""), 2000);
    } catch {
      setCopySuccess("Failed to copy");
    }
  };

  if (!project) return <div className="text-gray-400">No project selected</div>;

  return (
    <div className="max mx-10 bg-white rounded shadow p-6 mt-10">
      <h2 className="text-2xl font-bold mb-4">Project Members</h2>

      {/* Member list */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Members</label>
        {members.length > 0 ? (
          <ul className="list-disc list-inside">
            {members.map((member, idx) => (
              <li key={idx} className="text-sm text-gray-700">
                {member.email}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No members yet</p>
        )}
      </div>

      {/* Error */}
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
};

export default MemberPage;
