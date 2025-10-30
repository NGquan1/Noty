import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import io from "socket.io-client";
import toast from "react-hot-toast";

export const useChatStore = create((set, get) => ({
  socket: null,
  messages: [],
  isConnected: false,

  connectSocket: () => {
    if (get().socket) return;

    const socketUrl = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "");
    console.log("🌐 Connecting to Socket.IO:", socketUrl);

    const newSocket = io(socketUrl, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      console.log("✅ Connected to Socket.IO:", newSocket.id);
      set({ socket: newSocket, isConnected: true });
    });

    newSocket.on("disconnect", (reason) => {
      console.warn("⚠️ Disconnected from Socket.IO:", reason);
      set({ socket: null, isConnected: false });
    });

    newSocket.on("receive_message", (newMessage) => {
      set((state) => {
        const optimisticMsg = state.messages.find(
          (msg) =>
            msg._id.startsWith("temp_") &&
            msg.text === newMessage.text &&
            msg.sender._id === newMessage.sender &&
            msg.project === newMessage.project
        );

        if (optimisticMsg) {
          return {
            messages: state.messages.map((msg) =>
              msg._id === optimisticMsg._id ? newMessage : msg
            ),
          };
        }

        if (!state.messages.some((msg) => msg._id === newMessage._id)) {
          return { messages: [...state.messages, newMessage] };
        }

        return state;
      });
    });
  },

  disconnectSocket: () => {
    console.log("🔌 Disconnecting Socket.IO...");
    get().socket?.disconnect();
    set({ socket: null, isConnected: false, messages: [] });
  },

  fetchMessages: async (projectId) => {
    console.log("📨 Fetching messages for project:", projectId);
    try {
      const res = await axiosInstance.get(`/messages/${projectId}`);
      set({ messages: res.data });
    } catch (error) {
      console.error("❌ Failed to fetch messages:", error);
      set({ messages: [] });
    }
  },

  sendMessage: (data) => {
    get().socket?.emit("send_message", data);
  },

  addOptimisticMessage: (message) => {
    set((state) => ({ messages: [...state.messages, message] }));
  },

  deleteMessage: async (messageId) => {
    const originalMessages = get().messages;
    set((state) => ({
      messages: state.messages.filter((msg) => msg._id !== messageId),
    }));

    if (messageId.startsWith("temp_")) return;

    try {
      await axiosInstance.delete(`/messages/${messageId}`);
    } catch (error) {
      toast.error("Can't delete messages");
      set({ messages: originalMessages });
    }
  },
}));
