import { create } from "zustand";
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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
      const normalized = normalizeColumns(res.data);
      set({ columns: normalized });
    } catch (err) {
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

  moveCardInClient: (
    fromColumnIndex,
    fromCardIndex,
    toColumnIndex,
    toCardIndex
  ) => {
    set((state) => {
      const newColumns = [...state.columns];
      const sourceCol = newColumns[fromColumnIndex];
      const [movedCard] = sourceCol.cards.splice(fromCardIndex, 1);

      if (!movedCard) {
        return { columns: state.columns };
      }

      const destCol = newColumns[toColumnIndex];
      destCol.cards.splice(toCardIndex, 0, movedCard);

      return { columns: newColumns };
    });
  },

  moveCardOnServer: async (
    cardId,
    fromColumnIndex,
    toColumnIndex,
    toCardIndex,
    originalFromCardIndex
  ) => {
    const state = get();

    let fromColIdx = fromColumnIndex;
    let toColIdx = toColumnIndex;
    if (typeof fromColumnIndex === "string") {
      fromColIdx = state.columns.findIndex(
        (col) => col.id === fromColumnIndex || col._id === fromColumnIndex
      );
    }
    if (typeof toColumnIndex === "string") {
      toColIdx = state.columns.findIndex(
        (col) => col.id === toColumnIndex || col._id === toColumnIndex
      );
    }

    const fromColumn = state.columns[fromColIdx];
    const toColumn = state.columns[toColIdx];

    const fromColumnId = fromColumn?._id || fromColumn?.id;
    const toColumnId = toColumn?._id || toColumn?.id;
    const projectId = state.selectedProjectId;

    if (!fromColumnId || !toColumnId) {
      return { error: "Missing column IDs" };
    }

    try {
      let res;
      if (fromColumnId === toColumnId) {
        const originalCardPosition = originalFromCardIndex;

        if (originalCardPosition === -1 || originalCardPosition === undefined) {
          return { error: "Original card position missing" };
        }

        res = await API.patch(`/columns/${fromColumnId}/cards/reorder`, {
          fromIndex: originalCardPosition,
          toIndex: toCardIndex,
        });
      } else {
        res = await API.patch(`/cards/${cardId}/move`, {
          fromColumnId,
          toColumnId,
          toCardIndex,
        });
      }

      await new Promise((resolve) => setTimeout(resolve, 100));

      await get().fetchColumns(projectId);

      return res.data;
    } catch (err) {
      await get().fetchColumns(projectId);
      throw err;
    }
  },
}));
