import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import io from "socket.io-client";
import toast from "react-hot-toast";

export const useChatStore = create((set, get) => ({
  socket: null,
  messages: [],
  isConnected: false,
  onlineUsers: {},
  remoteCursors: {},

  connectSocket: (userId) => {
    if (get().socket) return;

    const socketUrl = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "");

    const newSocket = io(socketUrl, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      set({ socket: newSocket, isConnected: true });
    });

    newSocket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error);
    });

    newSocket.on("reconnect", (attemptNumber) => {});

    newSocket.on("disconnect", (reason) => {
      console.warn("⚠️ Disconnected from Socket.IO:", reason);
      set({
        socket: null,
        isConnected: false,
        onlineUsers: {},
        remoteCursors: {},
      });
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

    newSocket.on("user-joined", (userData) => {
      console.log("👥 User joined project:", userData);
      set((state) => ({
        onlineUsers: {
          ...state.onlineUsers,
          [userData.userId]: userData,
        },
      }));
    });

    newSocket.on("user-left", (userData) => {
      console.log("🚪 User left project:", userData);
      set((state) => {
        const newOnlineUsers = { ...state.onlineUsers };
        const newRemoteCursors = { ...state.remoteCursors };

        delete newOnlineUsers[userData.userId];
        delete newRemoteCursors[userData.userId];

        return {
          onlineUsers: newOnlineUsers,
          remoteCursors: newRemoteCursors,
        };
      });
    });

    newSocket.on("remote-cursor-move", (data) => {
      console.log("🖱️ Remote cursor moved:", data);
      set((state) => ({
        remoteCursors: {
          ...state.remoteCursors,
          [data.userId]: {
            ...data,
            lastUpdated: Date.now(),
          },
        },
      }));
    });
  },

  disconnectSocket: () => {
    console.log("🔌 Disconnecting Socket.IO...");
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({
        socket: null,
        isConnected: false,
        messages: [],
        onlineUsers: {},
        remoteCursors: {},
      });
    }
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

  sendCursorPosition: (projectId, position, elementId = null) => {
    const { socket, isConnected } = get();
    if (socket && isConnected) {
      socket.emit("cursor-move", { projectId, position, elementId });
    }
  },

  joinProject: (projectId) => {
    const { socket, isConnected } = get();
    if (socket && isConnected) {
      socket.emit("join-project", projectId);
    }
  },

  leaveProject: (projectId) => {
    const { socket } = get();
    if (socket) {
      socket.emit("leave-project", projectId);
    }
  },
}));
