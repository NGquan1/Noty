connectSocket: (userId) => {
  if (get().socket) return;

  const SOCKET_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:5001"
      : "https://noty-backend-366n.onrender.com";

  const newSocket = io(SOCKET_URL, {
    withCredentials: true,
    transports: ["websocket", "polling"], // fallback
    query: { userId },
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  newSocket.on("connect", () => {
    console.log("✅ Connected to Socket.IO server:", newSocket.id);
    set({ socket: newSocket, isConnected: true });
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

  newSocket.on("message_deleted", ({ messageId }) => {
    set((state) => ({
      messages: state.messages.filter((msg) => msg._id !== messageId),
    }));
  });

  newSocket.on("disconnect", (reason) => {
    console.log("⚠️ Disconnected from Socket.IO server:", reason);
    set({ socket: null, isConnected: false });
  });
};
