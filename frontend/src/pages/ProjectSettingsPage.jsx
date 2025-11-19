import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useProjectStore } from "../store/useProjectStore";
import {
  Trash,
  Copy,
  Link2,
  Settings,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import RemoteCursor from "../components/RemoteCursor";
import { useChatStore } from "../store/useChatStore";

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

  const { joinProject, leaveProject } = useChatStore();

  useEffect(() => {
    if (selectedProjectId) {
      joinProject(selectedProjectId);
    }

    return () => {
      if (selectedProjectId) {
        leaveProject(selectedProjectId);
      }
    };
  }, [selectedProjectId, joinProject, leaveProject]);

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
    <div className="max-w-3xl mx-auto border-2 border-gray-200 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-10 mt-12 transition-all duration-300 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
        <div className="absolute top-10 right-10 w-32 h-32 bg-violet-200/30 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-indigo-200/20 rounded-full blur-2xl"></div>

        {/* Decorative corners */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-200/20 to-transparent rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-200/20 to-transparent rounded-tr-full"></div>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-10 relative z-10">
        <div className="p-3 bg-gradient-to-br from-violet-500/10 to-blue-500/10 rounded-2xl backdrop-blur-sm border border-violet-200/30">
          <Settings className="w-7 h-7 text-violet-600" />
        </div>
        <div>
          <h2 className="text-4xl font-extrabold text-gray-800">
            Project Settings
          </h2>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Configure your project
          </p>
        </div>
      </div>

      {/* Rename Section */}
      <div className="mb-10 relative z-10">
        <label className="block font-bold mb-3 text-lg text-gray-800">
          Project Name
        </label>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <input
            className="border-2 border-gray-300 px-5 py-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-500 text-base bg-white shadow-md transition-all"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            disabled={loading}
          />
          <button
            onClick={handleRename}
            disabled={loading || !newName.trim()}
            className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-7 py-3 rounded-xl font-bold hover:from-gray-900 hover:to-black transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-60 whitespace-nowrap relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="relative z-10">Save</span>
          </button>
        </div>
      </div>

      {/* Share Section */}
      <div className="mb-10 border-t-2 border-gray-200 pt-8 relative z-10">
        <label className="font-bold mb-3 text-lg text-gray-800 flex items-center gap-2">
          <Link2 className="w-5 h-5 text-gray-700" /> Share Project Link
        </label>
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
          <select
            value={shareRole}
            onChange={(e) => setShareRole(e.target.value)}
            className="border-2 border-gray-300 px-5 py-3 rounded-xl bg-white text-base shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 font-semibold"
            disabled={loading}
          >
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
          <button
            onClick={handleGenerateShareLink}
            className="bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg disabled:opacity-60 hover:scale-105 whitespace-nowrap relative overflow-hidden group"
            disabled={loading}
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="relative z-10">Generate Link</span>
          </button>
        </div>

        {shareLink && (
          <div className="flex items-center gap-3 bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border-2 border-gray-200 shadow-inner">
            <input
              type="text"
              readOnly
              value={shareLink}
              className="border-2 border-gray-300 px-4 py-3 rounded-xl w-full text-sm bg-white shadow-sm font-mono"
            />
            <button
              onClick={handleCopy}
              className="bg-gray-200 hover:bg-gray-300 p-3 rounded-xl transition-all shadow-md hover:scale-105 flex-shrink-0 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gray-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Copy size={20} className="relative z-10" />
            </button>
            {copySuccess && (
              <span className="text-green-600 text-sm font-bold whitespace-nowrap">
                {copySuccess}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Delete Section */}
      <div className="border-t-2 border-gray-200 pt-8 relative z-10">
        <div className="bg-gradient-to-br from-red-50 to-white p-6 rounded-xl border-2 border-red-200">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-1">
                Danger Zone
              </h3>
              <p className="text-sm text-gray-600">
                Once you delete a project, there is no going back. Please be
                certain.
              </p>
            </div>
          </div>
          <button
            className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 relative overflow-hidden group"
            onClick={() => setShowDeleteModal(true)}
            disabled={loading}
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Trash size={20} className="relative z-10" />
            <span className="relative z-10">Delete Project</span>
          </button>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border-2 border-gray-200 animate-[fadeIn_0.2s_ease] relative overflow-hidden">
            {/* Decorative corner */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-100/50 to-transparent rounded-bl-full"></div>

            <div className="relative z-10">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-red-100 rounded-full">
                  <AlertTriangle className="w-12 h-12 text-red-600" />
                </div>
              </div>
              <h3 className="text-2xl font-black mb-3 text-gray-800 text-center">
                Confirm Delete
              </h3>
              <p className="text-gray-600 text-center mb-6 leading-relaxed">
                Are you sure you want to delete{" "}
                <span className="font-bold text-gray-800">
                  "{project.name}"
                </span>
                ? This action cannot be undone and all project data will be
                permanently lost.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={handleDelete}
                  className="px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 relative overflow-hidden group"
                  disabled={loading}
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative z-10">Delete Forever</span>
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-6 py-3 rounded-xl font-bold bg-gray-200 text-gray-800 hover:bg-gray-300 transition-all shadow-md hover:scale-105"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-red-500 font-bold text-center mt-6 bg-red-50 p-4 rounded-xl border-2 border-red-200 relative z-10">
          {error}
        </div>
      )}

      {/* Remote cursor component - renders when in a project */}
      {selectedProjectId && <RemoteCursor projectId={selectedProjectId} />}
    </div>
  );
};

export default ProjectSettingsPage;
