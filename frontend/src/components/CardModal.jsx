import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

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
  const [status, setStatus] = useState(initialCardData?.status || "to-do");

  useEffect(() => {
    setMember(initialCardData?.member || "");
    setTasks(initialCardData?.tasks ? initialCardData.tasks.join("\n") : "");
    setStatus(initialCardData?.status || "to-do");
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
      status,
    };
    onSave(newCard, columnIndex, initialCardData?.id);

    setMember("");
    setTasks("");
    setStatus("to-do");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 0.95 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white p-6 rounded-lg shadow-xl flex flex-col gap-4 w-full max-w-md relative z-50"
              onClick={(e) => e.stopPropagation()}
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

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Title
                </label>
                <input
                  className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                  value={member}
                  onChange={(e) => setMember(e.target.value)}
                  placeholder="Member's name (ex: John Doe)"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Description
                </label>
                <textarea
                  className="border border-gray-300 px-4 py-2 rounded-md min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                  value={tasks}
                  onChange={(e) => setTasks(e.target.value)}
                  placeholder="Tasks"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Progression
                </label>
                <select
                  className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="to-do">To-Do</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="finished">Finished</option>
                  <option value="normal">Neutral</option>
                  <option value="urgent">Urgent</option>
                  <option value="important">Important</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>

              <div className="flex gap-3 mt-4 justify-end">
                <button
                  type="submit"
                  className="bg-gray-700 text-white px-5 py-2 rounded-md hover:bg-gray-500 transition-colors shadow-md"
                >
                  {initialCardData ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-300 text-gray-800 px-5 py-2 rounded-md hover:bg-gray-400 transition-colors shadow-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CardModal;
