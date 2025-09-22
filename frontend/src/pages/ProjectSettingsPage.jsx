import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useProjectStore } from "../store/useProjectStore";
import { Trash, Copy } from "lucide-react";

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
      setError("Delete failed");
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

  if (!project) return <div className="text-gray-400">No project selected</div>;

  return (
    <div className="max-w-2xl mx-auto border border-primary bg-gradient-to-br from-gray-100 to-white rounded-3xl shadow-xl p-10 mt-10">
      <h2 className="text-3xl font-extrabold mb-8 text-primary drop-shadow text-center">
        Project Settings
      </h2>

      {/* Rename */}
      <div className="mb-8">
        <label className="block font-semibold mb-2 text-lg">Project Name</label>
        <div className="flex flex-col items-start gap-4 w-full max-w-md">
          <input
            className="border-2 border-gray-200 px-4 py-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-primary/30 text-base bg-white shadow-sm"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            disabled={loading}
          />
          <button
            className="bg-gray-700/90 text-white px-6 py-2 rounded-xl font-bold transition-all duration-150 hover:bg-primary disabled:opacity-60 shadow-md hover:scale-105"
            onClick={handleRename}
            disabled={loading || !newName.trim()}
          >
            Save
          </button>
        </div>
      </div>

      {/* Delete */}
      <div className="mb-8">
        <button
          className="flex items-center gap-2 bg-red-500 text-white px-5 py-2 rounded-xl font-semibold hover:bg-red-600 transition-all shadow-md hover:scale-105"
          onClick={() => setShowDeleteModal(true)}
          disabled={loading}
        >
          <Trash size={20} />
          Delete Project
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 transition-opacity duration-300 animate-fade-in">
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-200 dark:border-gray-700 transform transition-all duration-300 scale-95 opacity-0 animate-modal-in"
            style={{
              animation: "modal-in 0.25s cubic-bezier(0.4,0,0.2,1) forwards",
            }}
          >
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white text-center">
              Confirm Delete
            </h3>
            <p className="mb-6 text-gray-600 dark:text-gray-300 text-center">
              Are you sure you want to delete this project and all its data?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-5 py-2 rounded-xl font-semibold bg-red-500 text-white hover:bg-red-600 transition-all shadow-md hover:scale-105"
                onClick={handleDelete}
                disabled={loading}
              >
                Delete
              </button>
              <button
                className="px-5 py-2 rounded-xl font-semibold bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all shadow-md hover:scale-105"
                onClick={() => setShowDeleteModal(false)}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
          {/* Inline keyframes for modal animation */}
          <style>{`
            @keyframes modal-in {
              0% { opacity: 0; transform: scale(0.95); }
              100% { opacity: 1; transform: scale(1); }
            }
          `}</style>
        </div>
      )}

      {/* Share */}
      <div className="mb-8">
        <label className="block font-semibold mb-2 text-lg">
          Share Project Link
        </label>
        <div className="flex items-center gap-4 mb-4">
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
            className="bg-gray-700 hover:bg-primary text-white px-5 py-2 rounded-xl font-semibold transition-all shadow-md disabled:opacity-60 hover:scale-105"
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
              className="bg-gray-200 hover:bg-primary/10 p-2 rounded-xl transition-all shadow hover:scale-105"
            >
              <Copy size={16} />
            </button>
            {copySuccess && (
              <span className="text-green-600 text-sm font-semibold hover:scale-105">
                {copySuccess}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="text-red-500 font-semibold text-center mt-2">
          {error}
        </div>
      )}
    </div>
  );
};

export default ProjectSettingsPage;
