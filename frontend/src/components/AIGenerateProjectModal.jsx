import React, { useState } from "react";

const AIGenerateProjectModal = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    deadline: "",
    members: 1,
    goals: "",
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      await onSubmit(form);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className={`bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative animate-fadeIn transition-all ${
          isGenerating ? "opacity-60 pointer-events-none" : ""
        }`}
      >
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
          onClick={onClose}
          aria-label="Close"
          disabled={isGenerating}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          AI Project Generator
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1 text-gray-700">
              Project Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none text-gray-900"
              required
              placeholder="e.g. Teamwork Management, Study Project..."
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">
              Project Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none text-gray-900"
              rows={3}
              required
              placeholder="Short description about goals, scope, content..."
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">
              Deadline
            </label>
            <input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">
              Number of Members
            </label>
            <input
              type="number"
              name="members"
              min={1}
              value={form.members}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-blue-700">
              Goals / Special Requirements
            </label>
            <textarea
              name="goals"
              value={form.goals}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none text-gray-900"
              rows={2}
              placeholder="e.g. Need AI to split tasks, create meetings, remind deadlines, etc. (optional)"
            />
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className={`w-full font-semibold py-2 rounded-lg transition ${
              isGenerating
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-gray-700 hover:bg-primary/90 text-white"
            }`}
          >
            {isGenerating ? "Generating..." : "Generate Project with AI"}
          </button>
        </form>
      </div>

      {isGenerating && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/50 text-white px-6 py-3 rounded-lg shadow-lg animate-pulse">
            🔮 Generating project with AI...
          </div>
        </div>
      )}
    </div>
  );
};

export default AIGenerateProjectModal;
