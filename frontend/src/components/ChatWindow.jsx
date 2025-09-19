import React, { useEffect, useState, useRef } from 'react';
import { X, Send, Trash2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';

const ChatWindow = ({ isOpen, onClose, projectId }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const messageContainerRef = useRef(null);

  const { authUser } = useAuthStore();
  const { messages, fetchMessages, sendMessage, addOptimisticMessage, deleteMessage, socket } = useChatStore();

  useEffect(() => {
    if (isOpen && projectId) {
      fetchMessages(projectId);
      socket?.emit("join_project", projectId);
    }
  }, [isOpen, projectId, fetchMessages, socket]);

  useEffect(() => {
    if (isOpen && messageContainerRef.current && messages.length > 0) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [isOpen, messages]);

  const handleSendMessage = () => {
    if (currentMessage.trim() === "" || !projectId || !authUser) return;

    const optimisticMessage = {
      _id: `temp_${Date.now()}`,
      text: currentMessage,
      sender: {
        _id: authUser._id,
        fullName: authUser.fullName,
        profilePic: authUser.profilePic,
      },
      project: projectId,
      createdAt: new Date().toISOString(),
    };
    
    addOptimisticMessage(optimisticMessage);
    
    sendMessage({
      projectId,
      text: currentMessage,
      senderId: authUser._id,
    });
    
    setCurrentMessage("");
  };

  if (!isOpen || !authUser) return null;

  return (
  <div className="fixed bottom-8 right-8 w-96 h-[500px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col border border-gray-200 dark:border-gray-800 z-50 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-100/80 dark:bg-gray-800 rounded-t-2xl border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-bold text-lg text-gray-800 dark:text-white">Project Chat</h3>
        <button onClick={onClose} aria-label="Đóng chat" className="p-1 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-400">
          <X size={20} />
        </button>
      </div>

      {/* Message List */}
      <div ref={messageContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isOwn = msg.sender?._id === authUser._id;
          return (
            <div key={msg._id} className={`group flex items-center gap-2 ${isOwn ? "justify-end" : "justify-start"}`}>
              {isOwn && (
                <button onClick={() => deleteMessage(msg._id)} aria-label="Xóa tin nhắn" className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-400">
                  <Trash2 size={15} className="text-gray-500 dark:text-gray-300 hover:text-red-500" />
                </button>
              )}
              <div className={`flex items-start gap-3 ${isOwn ? "flex-row-reverse" : ""}`}>
                {!isOwn && (
                  <img src={msg.sender?.profilePic || "/default-avatar.png"} alt={msg.sender?.fullName} className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-gray-300 dark:border-gray-700"/>
                )}
                <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 px-1">{msg.sender?.fullName}</p>
                  <div className={`p-3 rounded-2xl max-w-xs shadow-md ${isOwn
                    ? "bg-gray-700 dark:bg-gray-800 text-white border border-gray-5 00 dark:border-gray-700"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700"}`}>
                    <p className="text-sm break-words leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              </div>
              {!isOwn && (
                <div className="w-[31px] h-[31px] flex-shrink-0" />
              )}
            </div>
          );
        })}
      </div>
      
      {/* Input */}
      <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <form className="relative flex" onSubmit={e => { e.preventDefault(); handleSendMessage(); }}>
          <input
            type="text"
            value={currentMessage}
            placeholder="Inputing messages..."
            className="flex-1 pl-4 pr-12 py-2 border border-gray-300 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-400 dark:bg-gray-800 dark:text-white"
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            autoComplete="off"
          />
          <button
            type="submit"
            onClick={handleSendMessage}
            className="absolute right-1 top-1/2 -translate-y-1/2 p-2 bg-gray-800 dark:bg-gray-900 text-white rounded-full shadow-lg hover:bg-gray-800 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;