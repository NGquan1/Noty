import { Plus, Bot, Sparkles, Folder } from "lucide-react";
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
    <div className="w-72 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white min-h-[90vh] flex flex-col p-6 gap-6 mt-24 rounded-2xl shadow-2xl mx-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Diagonal pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(
            45deg,
            #ffffff 0px,
            #ffffff 1px,
            transparent 1px,
            transparent 40px
          )`,
          }}
        ></div>

        {/* Gradient orbs */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-0 w-36 h-36 bg-indigo-500/10 rounded-full blur-3xl"></div>

        {/* Geometric shapes */}
        <div className="absolute top-40 right-8 w-16 h-16 border border-white/5 rounded-lg rotate-12"></div>
        <div className="absolute bottom-40 left-8 w-12 h-12 border border-white/5 rounded-full"></div>
      </div>

      <div className="relative z-10">
        <div className="text-2xl font-extrabold mb-4 tracking-wide flex items-center gap-2">
          <span className="drop-shadow-lg bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Workspace
          </span>
        </div>
        <div className="relative">
          <input
            className="w-full px-4 py-2.5 rounded-xl bg-gray-800/60 backdrop-blur-sm text-white mb-2 shadow-inner border border-gray-700/50 focus:ring-2 focus:ring-violet-500/60 focus:border-violet-500/50 focus:outline-none transition-all placeholder:text-gray-500"
            placeholder="Search project..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="absolute right-3 top-2.5 text-gray-500">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="relative">
        <hr className="border-2 border-violet-500/40 rounded-full my-1" />
      </div>

      <div className="mb-4 relative z-10 flex-1">
        <div className="flex items-center justify-between mb-4">
          <span className="font-bold text-lg tracking-wide flex items-center gap-2">
            <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></span>
            Projects
          </span>
          <div className="flex items-center gap-2">
            <button
              className="bg-gradient-to-br from-green-500 to-emerald-600 transition-all duration-200 ease-in-out transform hover:scale-110 hover:shadow-lg hover:shadow-green-500/50 text-white rounded-full p-2 shadow-lg relative group"
              onClick={() => setAIModalOpen(true)}
              aria-label="AI Generate Project"
            >
              <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Bot size={20} className="relative z-10" />
            </button>
            <button
              className="bg-gradient-to-br from-gray-100 to-gray-200 transition-all duration-200 ease-in-out transform hover:scale-110 hover:shadow-lg hover:shadow-violet-500/30 text-gray-900 rounded-full p-2 shadow-lg relative group"
              onClick={() => setModalOpen(true)}
              aria-label="Add project"
            >
              <div className="absolute inset-0 bg-violet-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Plus size={22} className="relative z-10" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 max-h-[calc(100vh-450px)] overflow-y-auto px-1 custom-scrollbar">
          {filteredProjects.map((project) => (
            <button
              key={project._id || project.id}
              className={`text-left px-4 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md border-2 relative overflow-hidden group ${
                selectedProjectId === (project._id || project.id)
                  ? "bg-gradient-to-r from-violet-600 to-violet-700 border-violet-500 text-white scale-[1.02] shadow-lg shadow-violet-500/30"
                  : "bg-gray-800/40 backdrop-blur-sm border-gray-700/30 hover:bg-gray-700/60 hover:border-violet-500/50 text-gray-200 hover:scale-[1.02]"
              }`}
              onClick={() => onSelectProject(project._id || project.id)}
            >
              {selectedProjectId !== (project._id || project.id) && (
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 to-violet-500/0 group-hover:from-violet-500/5 group-hover:to-violet-500/10 transition-all duration-300"></div>
              )}
              <span className="relative z-10 flex items-center gap-2">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    selectedProjectId === (project._id || project.id)
                      ? "bg-white"
                      : "bg-violet-400/50"
                  }`}
                ></span>
                {project.name}
              </span>
            </button>
          ))}
          {filteredProjects.length === 0 && (
            <div className="text-gray-400 px-4 py-3 italic rounded-xl bg-gray-800/40 backdrop-blur-sm shadow-inner border border-gray-700/30 text-center">
              No project found
            </div>
          )}
        </div>
      </div>

      {/* Footer decoration */}
      <div className="relative z-10 pt-4 border-t border-gray-700/50">
        <div className="flex items-center justify-center gap-2 text-gray-500 text-xs">
          <Sparkles className="w-3 h-3" />
          <span>
            {projects.length} {projects.length === 1 ? "Project" : "Projects"}
          </span>
        </div>
      </div>

      <ProjectModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
        onSave={async (data) => {
          await onAddProject(data);
          setModalOpen(false);
        }}
      />
      <AIGenerateProjectModal
        isOpen={aiModalOpen}
        onClose={() => setAIModalOpen(false)}
        onSubmit={async (data) => {
          try {
            await import("../lib/axios.js").then(({ axiosInstance }) =>
              axiosInstance.post("/ai/generate-project", data)
            );

            await import("../store/useProjectStore.js").then(
              ({ useProjectStore }) =>
                useProjectStore.getState().fetchProjects()
            );
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
