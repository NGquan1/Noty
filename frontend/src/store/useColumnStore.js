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
      console.log(
        "[STORE][fetchColumns] Fetching columns for project:",
        projectId
      );
      const res = await API.get(
        projectId ? `/columns?projectId=${projectId}` : "/columns"
      );
      const normalized = normalizeColumns(res.data);
      console.log("[STORE][fetchColumns] ✅ Received columns:", normalized);
      set({ columns: normalized });
    } catch (err) {
      console.error("[STORE][fetchColumns] ❌ Failed:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  createColumn: async (title) => {
    const state = get();
    const projectId = state.selectedProjectId;
    if (!projectId) throw new Error("No project selected");
    console.log(
      "[STORE][createColumn] Creating column for project:",
      projectId
    );
    const res = await API.post("/columns", { title, projectId });
    set((state) => ({
      columns: normalizeColumns([...state.columns, res.data]).filter(
        (col) => col.project == projectId
      ),
    }));
  },

  updateColumn: async (id, title) => {
    console.log("[STORE][updateColumn] Updating column:", { id, title });
    await API.put(`/columns/${id}`, { title });
    set((state) => ({
      columns: state.columns.map((col) =>
        col.id === id || col._id === id ? { ...col, title } : col
      ),
    }));
  },

  deleteColumn: async (id) => {
    console.log("[STORE][deleteColumn] Deleting column:", id);
    await API.delete(`/columns/${id}`);
    set((state) => ({
      columns: state.columns.filter((col) => col.id !== id && col._id !== id),
    }));
  },

  addCard: async (columnId, card) => {
    console.log("[STORE][addCard] Adding card to column:", columnId);
    await API.post(`/columns/${columnId}/cards`, card);
    await get().fetchColumns(get().selectedProjectId);
  },

  updateCard: async (columnId, cardId, card) => {
    console.log("[STORE][updateCard] Updating card:", {
      columnId,
      cardId,
      card,
    });
    await API.put(`/columns/${columnId}/cards/${cardId}`, card);
    await get().fetchColumns(get().selectedProjectId);
  },

  deleteCard: async (columnId, cardId) => {
    console.log("[STORE][deleteCard] Deleting card:", { columnId, cardId });
    await API.delete(`/columns/${columnId}/cards/${cardId}`);
    await get().fetchColumns(get().selectedProjectId);
  },

  moveCardInClient: (
    fromColumnIndex,
    fromCardIndex,
    toColumnIndex,
    toCardIndex
  ) => {
    console.log("[STORE][moveCardInClient] Moving card in UI:", {
      fromColumnIndex,
      fromCardIndex,
      toColumnIndex,
      toCardIndex,
    });
    set((state) => {
      const newColumns = [...state.columns];
      const sourceCol = newColumns[fromColumnIndex];
      const [movedCard] = sourceCol.cards.splice(fromCardIndex, 1);

      if (!movedCard) {
        console.warn("[STORE][moveCardInClient] ⚠️ No card found to move");
        return { columns: state.columns };
      }

      const destCol = newColumns[toColumnIndex];
      destCol.cards.splice(toCardIndex, 0, movedCard);

      return { columns: newColumns };
    });
  },

  // ✅ FIXED: convert index -> _id để tránh lỗi 400
  moveCardOnServer: async (
    cardId,
    fromColumnIndex,
    toColumnIndex,
    toCardIndex
  ) => {
    const state = get();
    const fromColumnId =
      state.columns[fromColumnIndex]?._id || state.columns[fromColumnIndex]?.id;
    const toColumnId =
      state.columns[toColumnIndex]?._id || state.columns[toColumnIndex]?.id;

    console.log("[STORE][moveCardOnServer] Moving card:", {
      cardId,
      fromColumnIndex,
      toColumnIndex,
      toCardIndex,
      fromColumnId,
      toColumnId,
    });

    if (!fromColumnId || !toColumnId) {
      console.error(
        "[STORE][moveCardOnServer] ❌ Missing column IDs:",
        fromColumnId,
        toColumnId
      );
      return;
    }

    try {
      const res = await API.patch(`/cards/${cardId}/move`, {
        fromColumnId,
        toColumnId,
        toCardIndex,
      });
      console.log("[STORE][moveCardOnServer] ✅ Server response:", res.data);
    } catch (err) {
      console.error("[STORE][moveCardOnServer] ❌ Failed:", err);
      await get().fetchColumns(get().selectedProjectId);
    }
  },
}));
