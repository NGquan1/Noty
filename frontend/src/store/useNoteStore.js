import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';

const useNoteStore = create((set) => ({
  notes: [],
  isLoading: false,
  error: null,

  fetchNotes: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get('/notes');
      set({ notes: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  createNote: async (noteData) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post('/notes', noteData);
      set((state) => ({
        notes: [...state.notes, response.data],
        isLoading: false
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateNote: async (id, noteData) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.put(`/notes/${id}`, noteData);
      set((state) => ({
        notes: state.notes.map((note) =>
          note._id === id ? response.data : note
        ),
        isLoading: false
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteNote: async (id) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete(`/notes/${id}`);
      set((state) => ({
        notes: state.notes.filter((note) => note._id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
}));

export default useNoteStore;
