import React from "react";

const EventModalForm = ({ eventForm, handleFormChange, onClose, onSave }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-4 md:p-6 relative animate-fadeIn mx-2 max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl z-10"
          onClick={onClose}
        >
          &times;
        </button>
        <h3 className="text-xl font-bold mb-4">Add / Edit Event</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            name="title"
            value={eventForm.title}
            onChange={handleFormChange}
            placeholder="Title"
            className="col-span-2 w-full border px-3 py-2 rounded bg-gray-100"
          />
          <textarea
            name="description"
            value={eventForm.description}
            onChange={handleFormChange}
            placeholder="Description"
            className="col-span-2 w-full border px-3 py-2 rounded bg-gray-100"
            rows={2}
          />
          <input
            type="date"
            name="startDate"
            value={eventForm.startDate}
            onChange={handleFormChange}
            className="border px-3 py-2 rounded bg-gray-100"
          />
          <input
            type="time"
            name="startTime"
            value={eventForm.startTime}
            onChange={handleFormChange}
            className="border px-3 py-2 rounded bg-gray-100"
          />
          <input
            type="date"
            name="endDate"
            value={eventForm.endDate}
            onChange={handleFormChange}
            className="border px-3 py-2 rounded bg-gray-100"
          />
          <input
            type="time"
            name="endTime"
            value={eventForm.endTime}
            onChange={handleFormChange}
            className="border px-3 py-2 rounded bg-gray-100"
          />
          <input
            name="location"
            value={eventForm.location}
            onChange={handleFormChange}
            placeholder="Location"
            className="col-span-2 w-full border px-3 py-2 rounded bg-gray-100"
          />
          <input
            name="labels"
            value={eventForm.labels}
            onChange={handleFormChange}
            placeholder="Labels"
            className="col-span-2 w-full border px-3 py-2 rounded bg-gray-100"
          />
          <input
            name="client"
            value={eventForm.client}
            onChange={handleFormChange}
            placeholder="Client"
            className="col-span-2 w-full border px-3 py-2 rounded bg-gray-100"
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="px-5 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="px-5 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600"
            onClick={onSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModalForm;
