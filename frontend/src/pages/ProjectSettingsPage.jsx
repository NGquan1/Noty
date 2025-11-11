import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useProjectStore } from "../store/useProjectStore";
import { Trash, Copy, Link2, Settings } from "lucide-react";

const ProjectSettingsPage = ({ selectedProjectId, onProjectDeleted }) => {
  const { projects, renameProject, deleteProject, shareProjectByLink } =
    useProjectStore();

  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shareRole, setShareRole] = useState("editor");
  const [shareLink, setShareLink] = useState("");
  const [copySuccess, setCopySuccess] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const project = projects.find(
    (p) => p._id === selectedProjectId || p.id === selectedProjectId
  );

  useEffect(() => {
    if (project) setNewName(project.name);
  }, [project]);

  const handleRename = async () => {
    setLoading(true);
    setError("");
    try {
      await renameProject(selectedProjectId, newName);
      toast.success("Project renamed successfully");
    } catch (err) {
      setError("Rename failed");
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    try {
      await deleteProject(selectedProjectId);
      toast.success("Project deleted successfully");
      setShowDeleteModal(false);
      if (onProjectDeleted) onProjectDeleted();
    } catch (err) {
      setError(err.message || "Delete failed");
    }
    setLoading(false);
  };

  const handleGenerateShareLink = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await shareProjectByLink(selectedProjectId, shareRole);
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

  if (!project)
    return (
      <div className="text-gray-400 text-center mt-10">No project selected</div>
    );

  return (
    <div className="max-w-2xl mx-auto border border-gray-200 bg-gradient-to-br from-gray-100 to-white rounded-3xl shadow-lg p-10 mt-12 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <Settings className="w-7 h-7 text-gray-700" />
        <h2 className="text-3xl font-extrabold text-gray-800 drop-shadow-sm">
          Project Settings
        </h2>
      </div>

      {/* Rename Section */}
      <div className="mb-10">
        <label className="block font-semibold mb-2 text-lg text-gray-800">
          Project Name
        </label>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <input
            className="border-2 border-gray-200 px-4 py-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-primary/30 text-base bg-white shadow-sm"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            disabled={loading}
          />
          <button
            onClick={handleRename}
            disabled={loading || !newName.trim()}
            className="bg-gray-700 text-white px-6 py-2 rounded-xl font-semibold hover:bg-black transition-all duration-150 shadow-md hover:scale-105 disabled:opacity-60"
          >
            Save
          </button>
        </div>
      </div>

      {/* Share Section */}
      <div className="mb-10 border-t border-gray-200 pt-8">
        <label className="block font-semibold mb-2 text-lg text-gray-800 flex items-center gap-2">
          <Link2 className="w-5 h-5 text-gray-700" /> Share Project Link
        </label>
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
          <select
            value={shareRole}
            onChange={(e) => setShareRole(e.target.value)}
            className="border-2 px-4 py-2 rounded-xl bg-white text-base shadow-sm"
            disabled={loading}
          >
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
          <button
            onClick={handleGenerateShareLink}
            className="bg-gray-700 hover:bg-black text-white px-5 py-2 rounded-xl font-semibold transition-all shadow-md disabled:opacity-60 hover:scale-105"
            disabled={loading}
          >
            Generate Link
          </button>
        </div>

        {shareLink && (
          <div className="flex items-center gap-3">
            <input
              type="text"
              readOnly
              value={shareLink}
              className="border-2 px-4 py-2 rounded-xl w-full text-base shadow-sm bg-gray-50"
            />
            <button
              onClick={handleCopy}
              className="bg-gray-200 hover:bg-gray-300 p-2 rounded-xl transition-all shadow-sm hover:scale-105"
            >
              <Copy size={18} />
            </button>
            {copySuccess && (
              <span className="text-green-600 text-sm font-semibold">
                {copySuccess}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Delete Section */}
      <div className="border-t border-gray-200 pt-8">
        <button
          className="flex items-center gap-2 bg-red-500 text-white px-5 py-2 rounded-xl font-semibold hover:bg-red-600 transition-all shadow-md hover:scale-105"
          onClick={() => setShowDeleteModal(true)}
          disabled={loading}
        >
          <Trash size={20} />
          Delete Project
        </button>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-200 animate-[fadeIn_0.2s_ease]">
            <h3 className="text-xl font-bold mb-3 text-gray-800 text-center">
              Confirm Delete
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete this project and all its data?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="px-5 py-2 rounded-xl font-semibold bg-red-500 text-white hover:bg-red-600 transition-all shadow-md hover:scale-105"
                disabled={loading}
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2 rounded-xl font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300 transition-all shadow-md hover:scale-105"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-red-500 font-semibold text-center mt-4">
          {error}
        </div>
      )}
    </div>
  );
};

export default ProjectSettingsPage;
