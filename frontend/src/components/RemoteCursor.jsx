import React, { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";

const RemoteCursor = ({ projectId }) => {
  const { remoteCursors, onlineUsers, sendCursorPosition } = useChatStore();
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!projectId) return;
      const x = e.clientX;
      const y = e.clientY;

      sendCursorPosition(projectId, { x, y });
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [projectId, sendCursorPosition]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      Object.keys(remoteCursors).forEach((userId) => {
        if (now - remoteCursors[userId].lastUpdated > 5000) {
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [remoteCursors]);

  return (
    <>
      {Object.entries(remoteCursors).map(([userId, cursorData]) => {
        const user = onlineUsers[userId];

        if (!user || !cursorData.position) {
          return null;
        }

        if (Date.now() - cursorData.lastUpdated > 3000) {
          return null;
        }

        return (
          <div
            key={userId}
            className="fixed pointer-events-none z-[9999] transition-transform duration-100 ease-out"
            style={{
              left: `${cursorData.position.x}px`,
              top: `${cursorData.position.y}px`,
              transform: "translate(0, -100%)",
            }}
          >
            <div className="flex items-center">
              <div
                className="w-4 h-4 rounded-full border-2 border-white shadow-lg"
                style={{ backgroundColor: user.color }}
              />
              <div
                className="ml-2 px-2 py-1 rounded text-xs text-white whitespace-nowrap shadow-lg min-w-[60px] text-center"
                style={{ backgroundColor: user.color }}
              >
                {user.username}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default RemoteCursor;
