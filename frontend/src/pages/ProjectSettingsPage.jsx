import React, { useState, useEffect } from "react";
import { useProjectStore } from "../store/useProjectStore";
import { Trash, Copy } from "lucide-react";

const ProjectSettingsPage = ({ selectedProjectId, onProjectDeleted }) => {
  const {
    projects,
    renameProject,
    deleteProject,
    shareProjectByLink,
  } = useProjectStore();

  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [shareRole, setShareRole] = useState("editor");
  const [shareLink, setShareLink] = useState("");
  const [copySuccess, setCopySuccess] = useState("");

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
    if (
      !window.confirm(
        "Are you sure you want to delete this project and all its data?"
      )
    )
      return;
    setLoading(true);
    setError("");
    try {
      await deleteProject(selectedProjectId);
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
      const data = await shareProjectByLink(selectedProjectId, shareRole); // ✅ dùng store API
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
    <div className="max-w-2xl mx-auto bg-gradient-to-br from-gray-100 to-white rounded-3xl shadow-xl p-10 mt-10">
      <h2 className="text-3xl font-extrabold mb-8 text-primary drop-shadow text-center">Project Settings</h2>

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
            className="bg-gray-700/90 text-white px-6 py-2 rounded-xl font-bold transition-all duration-150 hover:bg-primary scale-105 disabled:opacity-60 shadow-md"
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
          className="flex items-center gap-2 bg-red-500 text-white px-5 py-2 rounded-xl font-semibold hover:bg-red-600 transition-all shadow-md"
          onClick={handleDelete}
          disabled={loading}
        >
          <Trash size={20} />
          Delete Project
        </button>
      </div>

      {/* Share */}
      <div className="mb-8">
        <label className="block font-semibold mb-2 text-lg">Share Project Link</label>
        <div className="flex items-center gap-4 mb-4">
          <select
            value={shareRole}
            onChange={(e) => setShareRole(e.target.value)}
            className="border-2 px-4 py-2 rounded-xl bg-white text-base shadow-sm focus:ring-2 focus:ring-primary/30"
            disabled={loading}
          >
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
          <button
            onClick={handleGenerateShareLink}
            className="bg-gray-700 hover:bg-primary text-white px-5 py-2 rounded-xl font-semibold transition-all shadow-md disabled:opacity-60"
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
              className="bg-gray-200 hover:bg-primary/10 p-2 rounded-xl transition-all shadow"
            >
              <Copy size={16} />
            </button>
            {copySuccess && (
              <span className="text-green-600 text-sm font-semibold">{copySuccess}</span>
            )}
          </div>
        )}
      </div>

      {/* Error */}
      {error && <div className="text-red-500 font-semibold text-center mt-2">{error}</div>}
    </div>
  );
};

export default ProjectSettingsPage;
