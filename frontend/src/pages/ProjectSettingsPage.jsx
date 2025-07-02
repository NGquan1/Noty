import React, { useState } from "react";
import { useProjectStore } from "../store/useProjectStore";
import { Trash } from "lucide-react";

const ProjectSettingsPage = ({ selectedProjectId, onProjectDeleted }) => {
  const { projects, renameProject, deleteProject } = useProjectStore();
  const [isRenaming, setIsRenaming] = useState(false);
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
      setIsRenaming(false);
    } catch (err) {
      setError("Rename failed");
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this project and all its data?")) return;
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
        {isRenaming ? (
          <div className="flex gap-2">
            <input
              className="border px-2 py-1 rounded w-full"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              disabled={loading}
            />
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded"
              onClick={handleRename}
              disabled={loading || !newName.trim()}
            >
              Save
            </button>
            <button
              className="bg-gray-300 px-3 py-1 rounded"
              onClick={() => setIsRenaming(false)}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-lg">{project.name}</span>
            <button
              className="bg-gray-200 px-2 py-1 rounded text-sm"
              onClick={() => setIsRenaming(true)}
            >
              Rename
            </button>
          </div>
        )}
      </div>
      <div className="mb-6">
        <button
          className="flex bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={handleDelete}
          disabled={loading}
        >
            <Trash size={20}/>
          Delete Project
        </button>
      </div>
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
};

export default ProjectSettingsPage;
