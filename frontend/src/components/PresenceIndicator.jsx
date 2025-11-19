import React from 'react';
import { useChatStore } from '../store/useChatStore';

const PresenceIndicator = () => {
  const { onlineUsers } = useChatStore();
  
  if (Object.keys(onlineUsers).length === 0) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
      <span className="text-sm text-gray-600 dark:text-gray-300">Collaborators:</span>
      <div className="flex space-x-1">
        {Object.values(onlineUsers).map((user) => (
          <div
            key={user.userId}
            title={user.username}
            className="w-3 h-3 rounded-full border border-white"
            style={{ backgroundColor: user.color }}
          />
        ))}
      </div>
      <span className="text-sm text-gray-500 dark:text-gray-400">
        ({Object.keys(onlineUsers).length} online)
      </span>
    </div>
  );
};

export default PresenceIndicator;