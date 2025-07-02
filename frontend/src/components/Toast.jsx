import React from "react";

const Toast = ({ message, type = "info", onClose }) => {
  return (
    <div
      className={`fixed top-6 right-6 z-50 px-4 py-2 rounded shadow-lg text-white transition-all duration-300 ${
        type === "success"
          ? "bg-green-500"
          : type === "error"
          ? "bg-red-500"
          : "bg-gray-800"
      }`}
      role="alert"
    >
      <div className="flex items-center gap-2">
        <span>{message}</span>
        <button
          className="ml-2 text-white hover:text-gray-200"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;
