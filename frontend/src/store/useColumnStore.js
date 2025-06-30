import { create } from "zustand";
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true,
});

function normalizeColumns(columns) {
  return columns.map((col) => ({
    ...col,
    cards: Array.isArray(col.cards)
      ? col.cards.map((card) => ({ ...card, id: card._id || card.id }))
      : [],
    id: col._id || col.id,
  }));
}

export const useColumnStore = create((set, get) => ({
  columns: [],
  isLoading: false,

  fetchColumns: async () => {
    set({ isLoading: true });
    try {
      const res = await API.get("/columns");
      set({ columns: normalizeColumns(res.data) });
    } finally {
      set({ isLoading: false });
    }
  },

  createColumn: async (title) => {
    const res = await API.post("/columns", { title });
    set((state) => ({ columns: normalizeColumns([...state.columns, res.data]) }));
  },

  updateColumn: async (id, title) => {
    await API.put(`/columns/${id}`, { title });
    set((state) => ({
      columns: state.columns.map((col) =>
        (col.id === id || col._id === id)
          ? { ...col, title }
          : col
      ),
    }));
  },

  deleteColumn: async (id) => {
    await API.delete(`/columns/${id}`);
    set((state) => ({
      columns: state.columns.filter((col) => col.id !== id && col._id !== id),
    }));
  },

  addCard: async (columnId, card) => {
    await API.post(`/columns/${columnId}/cards`, card);
    await get().fetchColumns();
  },

  updateCard: async (columnId, cardId, card) => {
    await API.put(`/columns/${columnId}/cards/${cardId}`, card);
    await get().fetchColumns();
  },

  deleteCard: async (columnId, cardId) => {
    await API.delete(`/columns/${columnId}/cards/${cardId}`);
    await get().fetchColumns();
  },
}));
