import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import io from "socket.io-client";
import toast from "react-hot-toast";

export const useChatStore = create((set, get) => ({
  socket: null,
  messages: [],
  isConnected: false,

  connectSocket: (userId) => {
    if (get().socket) {
      console.log("⚠️ Socket already exists, skipping new connection.");
      return;
    }

    console.log(
      "🌐 Attempting to connect to Socket.IO server at:",
      import.meta.env.VITE_API_URL
    );

    // Chuẩn hóa URL socket (bỏ /api nếu có)
    const socketUrl = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "");
    console.log("🌐 Attempting to connect to Socket.IO server at:", socketUrl);

    const newSocket = io(socketUrl, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      console.log("✅ Connected to Socket.IO server with ID:", newSocket.id);
      console.log("🔌 Transport:", newSocket.io.engine.transport.name);
      set({ socket: newSocket, isConnected: true });
    });

    newSocket.io.on("reconnect_attempt", (attempt) => {
      console.warn(`⚠️ Reconnect attempt #${attempt}`);
    });

    newSocket.io.on("reconnect_error", (err) => {
      console.error("❌ Reconnect error:", err);
    });

    newSocket.io.on("error", (err) => {
      console.error("❌ Socket.IO client error:", err);
    });

    newSocket.on("receive_message", (newMessage) => {
      console.log("📩 Received new message:", newMessage);
      set((state) => {
        const optimisticMsg = state.messages.find(
          (msg) =>
            msg._id.startsWith("temp_") &&
            msg.text === newMessage.text &&
            msg.sender._id === newMessage.sender &&
            msg.project === newMessage.project
        );

        if (optimisticMsg) {
          console.log("✨ Replacing optimistic message with real one");
          return {
            messages: state.messages.map((msg) =>
              msg._id === optimisticMsg._id ? newMessage : msg
            ),
          };
        }

        if (!state.messages.some((msg) => msg._id === newMessage._id)) {
          console.log("🆕 Adding new message to state");
          return { messages: [...state.messages, newMessage] };
        }

        return state;
      });
    });

    newSocket.on("message_deleted", ({ messageId }) => {
      console.log("🗑️ Message deleted:", messageId);
      set((state) => ({
        messages: state.messages.filter((msg) => msg._id !== messageId),
      }));
    });

    newSocket.on("disconnect", (reason) => {
      console.warn("⚠️ Disconnected from Socket.IO server. Reason:", reason);
      set({ socket: null, isConnected: false });
    });
  },

  disconnectSocket: () => {
    console.log("🔌 Disconnecting Socket.IO client...");
    get().socket?.disconnect();
    set({ socket: null, isConnected: false, messages: [] });
  },

  fetchMessages: async (projectId) => {
    console.log("📨 Fetching messages for project:", projectId);
    try {
      const res = await axiosInstance.get(`/messages/${projectId}`);
      console.log("✅ Messages fetched:", res.data.length);
      set({ messages: res.data });
    } catch (error) {
      console.error("❌ Failed to fetch messages:", error);
      set({ messages: [] });
    }
  },

  sendMessage: (data) => {
    console.log("📤 Sending message:", data);
    get().socket?.emit("send_message", data);
  },

  addOptimisticMessage: (message) => {
    console.log("🪄 Adding optimistic message:", message);
    set((state) => ({ messages: [...state.messages, message] }));
  },

  deleteMessage: async (messageId) => {
    console.log("🗑️ Deleting message:", messageId);
    const originalMessages = get().messages;
    set((state) => ({
      messages: state.messages.filter((msg) => msg._id !== messageId),
    }));

    if (messageId.startsWith("temp_")) {
      console.log("⚠️ Skipping delete request for temporary message");
      return;
    }

    try {
      await axiosInstance.delete(`/messages/${messageId}`);
      console.log("✅ Message deleted from server");
    } catch (error) {
      console.error("❌ Can't delete message:", error);
      toast.error("Can't delete messages");
      set({ messages: originalMessages });
    }
  },
}));
