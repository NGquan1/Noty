import { Plus, Bot } from "lucide-react";
import React, { useState } from "react";
import ProjectModal from "./ProjectModal";

import AIGenerateProjectModal from "./AIGenerateProjectModal";

const Sidebar = ({
  projects,
  onAddProject,
  onSelectProject,
  selectedProjectId,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [aiModalOpen, setAIModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-72 bg-gradient-to-br from-gray-900 to-gray-500/90 text-white min-h-[90vh] flex flex-col p-6 gap-6 mt-24 rounded-2xl shadow-2xl mx-4">
      <div className="mb-4">
        <div className="text-2xl font-extrabold mb-3 tracking-wide flex items-center gap-2">
          <span className="drop-shadow">Workspace</span>
        </div>
        <input
          className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white mb-2 shadow focus:ring-2 focus:ring-primary/60 focus:outline-none transition-all"
          placeholder="Search project..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <hr className="border-gray-600 my-2 mt-0 " />
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-lg tracking-wide">Projects</span>
          <div className="flex items-center gap-2">
            <button
              className="bg-green-500/90 transition-all duration-200 ease-in-out transform hover:scale-110 hover:bg-green-500 text-white rounded-full p-2 shadow-lg"
              onClick={() => setAIModalOpen(true)}
              aria-label="AI Generate Project"
            >
              <Bot size={20} />
            </button>
            <button
              className="bg-gray-100/90 transition-all duration-200 ease-in-out transform hover:scale-110 hover:bg-violet-100 text-black hover:text-black rounded-full p-2 shadow-lg"
              onClick={() => setModalOpen(true)}
              aria-label="Add project"
            >
              <Plus size={22} />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {filteredProjects.map((project) => (
            <button
              key={project._id || project.id}
              className={`text-left px-4 py-2 rounded-xl font-semibold transition-all duration-150 shadow-md border-2 ${
                selectedProjectId === (project._id || project.id)
                  ? "bg-primary/90 border-primary text-white scale-[1.03]"
                  : "bg-gray-100 border-transparent hover:bg-primary/20 hover:border-primary text-gray-800"
              }`}
              onClick={() => onSelectProject(project._id || project.id)}
            >
              {project.name}
            </button>
          ))}
          {filteredProjects.length === 0 && (
            <div className="text-gray-300 px-4 py-2 italic rounded-xl bg-gray-700/60 shadow-inner">
              No project found
            </div>
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
      <AIGenerateProjectModal
        isOpen={aiModalOpen}
        onClose={() => setAIModalOpen(false)}
        onSubmit={async (data) => {
          try {
            const res = await import("../lib/axios.js").then(
              ({ axiosInstance }) =>
                axiosInstance.post("/ai/generate-project", data)
            );
            // Sau khi tạo thành công, reload lại danh sách project
            if (res.data.project) {
              if (typeof onAddProject === "function") {
                onAddProject(res.data.project);
              }
            }
          } catch (err) {
            alert("AI failed: " + (err?.response?.data?.error || err.message));
          }
          setAIModalOpen(false);
        }}
      />
    </div>
  );
};

export default Sidebar;
