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
    <div className="max mx-10 bg-white rounded shadow p-6 mt-10">
      <h2 className="text-2xl font-bold mb-4">Project Settings</h2>

      {/* Rename */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Project Name</label>
        <div className="flex flex-col items-start gap-3 w-full max-w-xs">
          <input
            className="border border-gray-200 px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-200 text-base bg-white"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            disabled={loading}
          />
          <button
            className="bg-blue-400 text-white px-5 py-2 rounded-lg font-semibold transition-colors duration-150 hover:bg-blue-500 disabled:opacity-60"
            onClick={handleRename}
            disabled={loading || !newName.trim()}
          >
            Save
          </button>
        </div>
      </div>

      {/* Delete */}
      <div className="mb-6">
        <button
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={handleDelete}
          disabled={loading}
        >
          <Trash size={20} />
          Delete Project
        </button>
      </div>

      {/* Share */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Share Project Link</label>
        <div className="flex items-center gap-4 mb-3">
          <select
            value={shareRole}
            onChange={(e) => setShareRole(e.target.value)}
            className="border px-3 py-2 rounded bg-white text-sm"
            disabled={loading}
          >
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
          <button
            onClick={handleGenerateShareLink}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-60"
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
              className="border px-3 py-2 rounded w-full text-sm"
            />
            <button
              onClick={handleCopy}
              className="bg-gray-200 hover:bg-gray-300 p-2 rounded"
            >
              <Copy size={16} />
            </button>
            {copySuccess && (
              <span className="text-green-600 text-sm">{copySuccess}</span>
            )}
          </div>
        )}
      </div>

      {/* Error */}
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
};

export default ProjectSettingsPage;
