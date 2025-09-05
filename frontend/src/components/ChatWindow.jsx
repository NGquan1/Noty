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
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

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
    <div className="fixed bottom-8 right-8 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200 z-50 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-100/80 rounded-t-2xl border-b border-gray-200">
        <h3 className="font-bold text-lg text-gray-800">Project Chat</h3>
        <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-200">
          <X size={20} />
        </button>
      </div>

      {/* Message List */}
      <div ref={messageContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div key={msg._id} className={`group flex items-center gap-2 ${msg.sender?._id === authUser._id ? "justify-end" : "justify-start"}`}>
            
            {msg.sender?._id === authUser._id && (
              <button onClick={() => deleteMessage(msg._id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-gray-200">
                <Trash2 size={15} className="text-gray-500 hover:text-red-500" />
              </button>
            )}

            <div className={`flex items-start gap-3 ${msg.sender?._id === authUser._id ? "flex-row-reverse" : ""}`}>
              {msg.sender?._id !== authUser._id && (
                <img src={msg.sender?.profilePic || "/default-avatar.png"} alt={msg.sender?.fullName} className="w-8 h-8 rounded-full object-cover flex-shrink-0"/>
              )}
              <div className={`flex flex-col ${msg.sender?._id === authUser._id ? "items-end" : "items-start"}`}>
                <p className="text-xs text-gray-500 mb-1 px-1">{msg.sender?.fullName}</p>
                <div className={`p-3 rounded-lg max-w-xs ${msg.sender?._id === authUser._id ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-800"}`}>
                  <p className="text-sm break-words">{msg.text}</p>
                </div>
              </div>
            </div>
            
            {msg.sender?._id !== authUser._id && (
               <div className="w-[31px] h-[31px] flex-shrink-0" />
            )}

          </div>
        ))}
      </div>
      
      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="relative flex">
          <input
            type="text" value={currentMessage} placeholder="Nhập tin nhắn..."
            className="flex-1 pl-4 pr-12 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-400"
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button onClick={handleSendMessage} className="absolute right-1 top-1/2 -translate-y-1/2 p-2 bg-violet-600 text-white rounded-full hover:bg-violet-700">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;