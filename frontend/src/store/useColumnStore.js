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

  moveCardOnServer: async (
    cardId,
    fromColumnIndex,
    toColumnIndex,
    toCardIndex,
    originalFromCardIndex // Add original card index parameter
  ) => {
    const state = get();
    console.group("[STORE][moveCardOnServer] 🟡 Start");
    console.log(
      "👉 Columns in state:",
      state.columns.map((c) => ({
        id: c.id,
        _id: c._id,
        title: c.title,
      }))
    );
    console.log("🧭 Params:", {
      cardId,
      fromColumnIndex,
      toColumnIndex,
      toCardIndex,
      originalFromCardIndex,
    });

    // Nếu fromColumnIndex là id, cần tìm index thực trong mảng columns
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

    console.log("📦 fromColumn:", fromColumn);
    console.log("📦 toColumn:", toColumn);

    const fromColumnId = fromColumn?._id || fromColumn?.id;
    const toColumnId = toColumn?._id || toColumn?.id;
    const projectId = state.selectedProjectId;

    console.log("🧩 Calculated IDs:", { fromColumnId, toColumnId });

    if (!fromColumnId || !toColumnId) {
      console.error("[STORE][moveCardOnServer] ❌ Missing column IDs");
      console.groupEnd();
      return { error: "Missing column IDs" };
    }

    try {
      let res;
      if (fromColumnId === toColumnId) {
        // For same column reorder, use the original card index passed from the drag item
        // This avoids the issue of trying to find the card in the current state which may already be updated
        const originalCardPosition = originalFromCardIndex;
        
        if (originalCardPosition === -1 || originalCardPosition === undefined) {
          console.error("Original card position not provided for reorder operation");
          return { error: "Original card position missing" };
        }

        res = await API.patch(`/columns/${fromColumnId}/cards/reorder`, {
          fromIndex: originalCardPosition,
          toIndex: toCardIndex,
        });
      } else {
        // Kéo sang column khác
        res = await API.patch(`/cards/${cardId}/move`, {
          fromColumnId,
          toColumnId,
          toCardIndex,
        });
      }
      console.log("[STORE][moveCardOnServer] ✅ Server response:", res.data);
      console.log("[STORE][moveCardOnServer] 🔁 Refetching columns...");
      
      // Small delay to ensure server has processed the update before fetching
      await new Promise(resolve => setTimeout(resolve, 100));
      
      await get().fetchColumns(projectId);
      console.log("[STORE][moveCardOnServer] ✅ Columns updated after move");
      
      // Return the server response so the calling function can access it
      return res.data;
    } catch (err) {
      console.error("[STORE][moveCardOnServer] ❌ Failed:", err);
      await get().fetchColumns(projectId);
      throw err; // Re-throw the error so the calling function can handle it
    } finally {
      console.groupEnd();
    }
  },
}));
