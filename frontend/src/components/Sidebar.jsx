import { Plus } from "lucide-react";
import React, { useState } from "react";
import ProjectModal from "./ProjectModal";

const Sidebar = ({
  projects,
  onAddProject,
  onSelectProject,
  selectedProjectId,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-64 bg-gray-700 text-white h-auto flex flex-col p-4 gap-4 mt-16">
      <div className="mb-4">
        <div className="text-lg font-bold mb-2">Workspace</div>
        <input
          className="w-full px-2 py-1 rounded bg-gray-600 text-white mb-2"
          placeholder="Search project..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <hr className="border-gray-500 my-2 mt-0 " />
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold">Projects</span>
          <button
            className="bg-gray-700 transition-all duration-200 ease-in-out transform hover:scale-110 hover:bg-gray-500 text-white rounded px-1 py-1 ml-2 rounded-md"
            onClick={() => setModalOpen(true)}
            aria-label="Add project"
          >
            <Plus size={24} />
          </button>
        </div>

        <div className="flex flex-col gap-1">
          {filteredProjects.map((project) => (
            <button
              key={project._id || project.id}
              className={`text-left px-2 py-1 rounded ${
                selectedProjectId === (project._id || project.id)
                  ? "bg-gray-500"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
              onClick={() => onSelectProject(project._id || project.id)}
            >
              {project.name}
            </button>
          ))}
          {filteredProjects.length === 0 && (
            <div className="text-gray-400 px-2 py-1">No project found</div>
          )}
        </div>
      </div>
      <ProjectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={(data) => {
          onAddProject(data);
          setModalOpen(false);
        }}
      />
    </div>
  );
};

export default Sidebar;
