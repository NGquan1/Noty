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
    project: col.project || (col.projectId ? col.projectId : undefined),
  }));
}

export const useColumnStore = create((set, get) => ({
  columns: [],
  isLoading: false,
  selectedProjectId: null,

  fetchColumns: async (projectId) => {
    set({ isLoading: true, selectedProjectId: projectId });
    try {
      const res = await API.get(
        projectId ? `/columns?projectId=${projectId}` : "/columns"
      );
      set({ columns: normalizeColumns(res.data) });
    } finally {
      set({ isLoading: false });
    }
  },

  createColumn: async (title) => {
    const state = get();
    const projectId = state.selectedProjectId;
    if (!projectId) throw new Error("No project selected");
    const res = await API.post("/columns", { title, projectId });
    set((state) => ({
      columns: normalizeColumns([...state.columns, res.data]).filter(
        (col) => col.project == projectId
      ),
    }));
  },

  updateColumn: async (id, title) => {
    await API.put(`/columns/${id}`, { title });
    set((state) => ({
      columns: state.columns.map((col) =>
        col.id === id || col._id === id ? { ...col, title } : col
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
    await get().fetchColumns(get().selectedProjectId);
  },

  updateCard: async (columnId, cardId, card) => {
    await API.put(`/columns/${columnId}/cards/${cardId}`, card);
    await get().fetchColumns(get().selectedProjectId);
  },

  deleteCard: async (columnId, cardId) => {
    await API.delete(`/columns/${columnId}/cards/${cardId}`);
    await get().fetchColumns(get().selectedProjectId);
  },

  moveCard: async (cardToMove, fromColumnIndex, toColumnIndex) => {
    const state = get();
    const columns = state.columns;
    const fromColumn = columns[fromColumnIndex];
    const toColumn = columns[toColumnIndex];
    const cardId = cardToMove._id || cardToMove.id;

    set((s) => {
      const newColumns = [...s.columns];
      newColumns[fromColumnIndex] = {
        ...fromColumn,
        cards: fromColumn.cards.filter(
          (c) => c.id !== cardId && c._id !== cardId
        ),
      };
      newColumns[toColumnIndex] = {
        ...toColumn,
        cards: [...toColumn.cards, { ...cardToMove }],
      };
      return { columns: newColumns };
    });

    try {
      await API.patch(`/cards/${cardId}/move`, {
        fromColumnId: fromColumn.id,
        toColumnId: toColumn.id,
      });
    } catch (err) {
      console.error("Move card failed", err);
      await get().fetchColumns(get().selectedProjectId);
    }
  },
}));
