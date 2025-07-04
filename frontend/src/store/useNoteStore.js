import { create } from "zustand";
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true,
});

export const useNoteStore = create((set, get) => ({
  notes: [],
  isLoading: false,

  fetchNotes: async (projectId) => {
    set({ isLoading: true });
    try {
      const res = await API.get("/notes", { params: { projectId } });
      set({ notes: res.data });
    } finally {
      set({ isLoading: false });
    }
  },

  createNote: async (noteData) => {
    const res = await API.post("/notes", noteData);
    set((state) => ({ notes: [...state.notes, res.data] }));
  },

  updateNote: async (noteId, updateData) => {
    await API.put(`/notes/${noteId}`, updateData);
    await get().fetchNotes(updateData.projectId);
  },

  deleteNote: async (noteId, projectId) => {
    await API.delete(`/notes/${noteId}`);
    await get().fetchNotes(projectId);
  },
}));
