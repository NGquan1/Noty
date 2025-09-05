import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import io from "socket.io-client";
import toast from "react-hot-toast";

export const useChatStore = create((set, get) => ({
  socket: null,
  messages: [],
  isConnected: false,

  connectSocket: (userId) => {
    if (get().socket) return;

    const newSocket = io("http://localhost:5001");

    newSocket.on("connect", () => {
      console.log("✅ Connected to Socket.IO server with ID:", newSocket.id);
      set({ socket: newSocket, isConnected: true });
    });

    newSocket.on("receive_message", (newMessage) => {
      if (!get().messages.some(msg => msg._id === newMessage._id)) {
        set((state) => ({ messages: [...state.messages, newMessage] }));
      }
    });

    newSocket.on('message_deleted', ({ messageId }) => {
      set(state => ({
        messages: state.messages.filter(msg => msg._id !== messageId)
      }));
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Disconnected from Socket.IO server");
      set({ socket: null, isConnected: false });
    });
  },

  disconnectSocket: () => {
    get().socket?.disconnect();
    set({ socket: null, isConnected: false, messages: [] }); // Reset state
  },

  fetchMessages: async (projectId) => {
    try {
      const res = await axiosInstance.get(`/messages/${projectId}`);
      set({ messages: res.data });
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      set({ messages: [] }); 
    }
  },

  sendMessage: (data) => {
    get().socket?.emit("send_message", data);
  },
  
  addOptimisticMessage: (message) => {
    set(state => ({ messages: [...state.messages, message] }));
  },

  deleteMessage: async (messageId) => {
    const originalMessages = get().messages;
    
    set(state => ({
      messages: state.messages.filter(msg => msg._id !== messageId)
    }));

    try {
      await axiosInstance.delete(`/messages/${messageId}`);
    } catch (error) {
      toast.error("Không thể xóa tin nhắn");
      set({ messages: originalMessages });
    }
  },
}));