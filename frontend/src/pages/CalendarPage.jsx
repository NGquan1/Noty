import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const COLORS = [
  "bg-blue-500 text-white",
  "bg-green-500 text-white",
  "bg-red-500 text-white",
  "bg-purple-500 text-white",
  "bg-yellow-400 text-black",
  "bg-pink-500 text-white",
  "bg-gray-400 text-white",
  "bg-orange-500 text-white",
];

const defaultEvent = (date) => ({
  title: "",
  description: "",
  startDate: date,
  endDate: date,
  startTime: "",
  endTime: "",
  location: "",
  labels: "",
  client: "",
  shareWith: [],
  file: null,
});

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState({}); // { '2025-07-04': [event, ...] }
  const [modalOpen, setModalOpen] = useState(false);
  const [eventForm, setEventForm] = useState(defaultEvent(new Date()));

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().slice(0, 10);
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setEventForm(defaultEvent(formatDate(date)));
    setModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setEventForm((prev) => ({
        ...prev,
        shareWith: checked
          ? [...prev.shareWith, value]
          : prev.shareWith.filter((v) => v !== value),
      }));
    } else if (type === "file") {
      setEventForm((prev) => ({ ...prev, file: files[0] }));
    } else {
      setEventForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveEvent = () => {
    const key = formatDate(selectedDate);
    setTasks((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), eventForm],
    }));
    setModalOpen(false);
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-10 border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-center">Event calendar</h2>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 min-w-[700px]">
          <Calendar
            value={selectedDate}
            onChange={setSelectedDate}
            onClickDay={handleDayClick}
            tileContent={({ date }) => {
              const key = formatDate(date);
              return (
                <div className="flex flex-col gap-1 mt-1">
                  {(tasks[key] || []).map((event, idx) => (
                    <div
                      key={idx}
                      className={`rounded px-1 text-xs font-semibold truncate cursor-pointer ${COLORS[idx % COLORS.length]} shadow`}
                      style={{ maxWidth: 90 }}
                      title={event.title}
                    >
                      {event.title.length > 14 ? event.title.slice(0, 14) + "..." : event.title}
                    </div>
                  ))}
                </div>
              );
            }}
            prevLabel={<span className="text-lg">&#60;</span>}
            nextLabel={<span className="text-lg">&#62;</span>}
            navigationLabel={({ date, label }) => (
              <span className="text-xl font-bold">{label}</span>
            )}
            className="mb-6 w-full border-none rounded-xl shadow-none min-w-[700px]"
            tileClassName={({ date, view }) =>
              [
                "!min-h-[60px] !rounded-lg !p-1",
                view === "month" && formatDate(date) === formatDate(selectedDate)
                  ? "bg-blue-100 border-2 border-blue-400"
                  : "hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-100 focus:text-blue-700"
              ].filter(Boolean).join(" ")
            }
            showNeighboringMonth={false}
            next2Label={null}
            prev2Label={null}
            tileDisabled={() => false}
          />
        </div>
        <div className="flex-1 max-w-xs mx-auto">
          <label className="block font-semibold mb-2 text-lg text-gray-700">
            Events for{" "}
            <span className="text-blue-600">{formatDate(selectedDate)}</span>
          </label>
          <div>
            <h3 className="font-semibold mb-2 text-gray-700">
              Events for {formatDate(selectedDate)}:
            </h3>
            <ul className="space-y-1">
              {(tasks[formatDate(selectedDate)] || []).length === 0 && (
                <li className="text-gray-400">No events for this day.</li>
              )}
              {(tasks[formatDate(selectedDate)] || []).map((event, idx) => (
                <li
                  key={idx}
                  className={`rounded px-2 py-1 text-sm font-medium ${COLORS[
                    idx % COLORS.length
                  ]}`}
                >
                  <div className="font-bold">{event.title}</div>
                  <div className="text-xs text-gray-600">{event.description}</div>
                  <div className="text-xs text-gray-400">
                    {event.startDate} {event.startTime} - {event.endDate} {event.endTime}
                  </div>
                  {event.location && <div className="text-xs text-gray-500">📍 {event.location}</div>}
                  {event.labels && <div className="text-xs text-gray-500">🏷 {event.labels}</div>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {/* Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-4 md:p-6 relative animate-fadeIn mx-2 max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl z-10"
              onClick={() => setModalOpen(false)}
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4">Add event</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-gray-600 mb-1">Title</label>
                <input
                  className="w-full border px-3 py-2 rounded bg-gray-100 mb-1"
                  name="title"
                  value={eventForm.title}
                  onChange={handleFormChange}
                  placeholder="Title"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-gray-600 mb-1">Description</label>
                <textarea
                  className="w-full border px-3 py-2 rounded bg-gray-100 mb-1"
                  name="description"
                  value={eventForm.description}
                  onChange={handleFormChange}
                  placeholder="Description"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Start date</label>
                <input
                  type="date"
                  className="w-full border px-3 py-2 rounded bg-gray-100 mb-1"
                  name="startDate"
                  value={eventForm.startDate}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Start time</label>
                <input
                  type="time"
                  className="w-full border px-3 py-2 rounded bg-gray-100 mb-1"
                  name="startTime"
                  value={eventForm.startTime}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">End date</label>
                <input
                  type="date"
                  className="w-full border px-3 py-2 rounded bg-gray-100 mb-1"
                  name="endDate"
                  value={eventForm.endDate}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">End time</label>
                <input
                  type="time"
                  className="w-full border px-3 py-2 rounded bg-gray-100 mb-1"
                  name="endTime"
                  value={eventForm.endTime}
                  onChange={handleFormChange}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-gray-600 mb-1">Location</label>
                <input
                  className="w-full border px-3 py-2 rounded bg-gray-100 mb-1"
                  name="location"
                  value={eventForm.location}
                  onChange={handleFormChange}
                  placeholder="Location"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-gray-600 mb-1">Labels</label>
                <input
                  className="w-full border px-3 py-2 rounded bg-gray-100 mb-1"
                  name="labels"
                  value={eventForm.labels}
                  onChange={handleFormChange}
                  placeholder="Labels"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-gray-600 mb-1">Client</label>
                <input
                  className="w-full border px-3 py-2 rounded bg-gray-100 mb-1"
                  name="client"
                  value={eventForm.client}
                  onChange={handleFormChange}
                  placeholder="Client"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-gray-600 mb-1">Share with</label>
                <div className="flex gap-4 mb-1">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="shareWith"
                      value="me"
                      checked={eventForm.shareWith.includes("me")}
                      onChange={handleFormChange}
                    />
                    Only me
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="shareWith"
                      value="team"
                      checked={eventForm.shareWith.includes("team")}
                      onChange={handleFormChange}
                    />
                    All team members
                  </label>
                </div>
              </div>
              <div className="col-span-2 flex items-center gap-4 mb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="file"
                    name="file"
                    className="hidden"
                    onChange={handleFormChange}
                  />
                  <span className="border px-3 py-1 rounded text-gray-500 bg-gray-100 flex items-center gap-2">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16.5 9.4V6.5A4.5 4.5 0 0 0 7.5 6.5v12a4.5 4.5 0 0 0 9 0v-2.9"/><path d="M12 16V2m0 0 3.5 3.5M12 2 8.5 5.5"/></svg>
                    Upload File
                  </span>
                  {eventForm.file && <span className="text-xs text-gray-500">{eventForm.file.name}</span>}
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-5 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
                onClick={() => setModalOpen(false)}
              >
                Close
              </button>
              <button
                className="px-5 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600"
                onClick={handleSaveEvent}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
