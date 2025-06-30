import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const CardModal = ({
  isOpen,
  onClose,
  onSave,
  initialCardData,
  columnIndex,
}) => {
  const [member, setMember] = useState(initialCardData?.member || "");
  const [tasks, setTasks] = useState(
    initialCardData?.tasks ? initialCardData.tasks.join("\n") : ""
  );

  useEffect(() => {
    setMember(initialCardData?.member || "");
    setTasks(initialCardData?.tasks ? initialCardData.tasks.join("\n") : "");
  }, [initialCardData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!member.trim() || !tasks.trim()) return;

    const newCard = {
      id: initialCardData?.id || (Math.random() * 100000).toFixed(0),
      member: member.trim(),
      tasks: tasks
        .split("\n")
        .map((t) => t.trim())
        .filter((t) => t),
    };
    onSave(newCard, columnIndex, initialCardData?.id);

    setMember("");
    setTasks("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-xl flex flex-col gap-4 w-full max-w-md relative"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {initialCardData ? "Edit card" : "Add card"}
        </h2>
        <input
          className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={member}
          onChange={(e) => setMember(e.target.value)}
          placeholder="Member's name (ex: John Doe)"
          autoFocus
        />
        <textarea
          className="border border-gray-300 px-4 py-2 rounded-md min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={tasks}
          onChange={(e) => setTasks(e.target.value)}
          placeholder="Tasks"
        />
        <div className="flex gap-3 mt-4 justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-md"
          >
            {initialCardData ? "Update" : "Save"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-5 py-2 rounded-md hover:bg-gray-400 transition-colors shadow-md"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default CardModal;
