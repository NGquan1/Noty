import React, { useState } from "react";
import { useProjectStore } from "../store/useProjectStore";
import { Trash } from "lucide-react";

const ProjectSettingsPage = ({ selectedProjectId, onProjectDeleted }) => {
  const { projects, renameProject, deleteProject } = useProjectStore();
    const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const project = projects.find(
    (p) => p._id === selectedProjectId || p.id === selectedProjectId
  );

  React.useEffect(() => {
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

  if (!project) return <div className="text-gray-400">No project selected</div>;

  return (
    <div className="max mx-10 bg-white rounded shadow p-6 mt-10">
      <h2 className="text-2xl font-bold mb-4">Project Settings</h2>
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
      <div className="mb-6">
        <button
          className="flex bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={handleDelete}
          disabled={loading}
        >
          <Trash size={20} />
          Delete Project
        </button>
      </div>
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
};

export default ProjectSettingsPage;
