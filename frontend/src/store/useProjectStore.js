import { create } from "zustand";
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true,
});

export const useProjectStore = create((set, get) => ({
  projects: [],
  isLoading: false,
  currentProjectId: null,

  fetchProjects: async () => {
    set({ isLoading: true });
    try {
      const res = await API.get("/projects");
      set({ projects: res.data });
    } finally {
      set({ isLoading: false });
    }
  },

  createProject: async (projectData) => {
    await API.post("/projects", projectData);
    await get().fetchProjects();
  },

  renameProject: async (projectId, newName) => {
    await API.put(`/projects/${projectId}`, { name: newName });
    await get().fetchProjects();
  },

  deleteProject: async (projectId) => {
    await API.delete(`/projects/${projectId}`);
    await get().fetchProjects();
  },

  shareProjectByLink: async (projectId, role) => {
    const res = await API.post(`/projects/${projectId}/share`, { role });
    return res.data;
  },

  setCurrentProjectId: (projectId) => set({ currentProjectId: projectId }),
}));
