import React, { useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useCalendarStore } from "../store/useCalendarStore";

const CalendarPage = () => {
  const {
    selectedDate,
    setSelectedDate,
    modalOpen,
    setModalOpen,
    eventForm,
    updateEventForm,
    tasks,
    loadEvents,
    addEvent,
    formatDate,
    COLORS,
    selectedEvent,
    setEventForm,
    setSelectedEvent,
    deleteEvent,
  } = useCalendarStore();

  useEffect(() => {
    loadEvents(); // load events khi vào trang
  }, []);

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setSelectedEvent(null); // bỏ chọn event khi chọn ngày khác
    setModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      updateEventForm("shareWith", value);
    } else if (type === "file") {
      updateEventForm(name, files[0]);
    } else {
      updateEventForm(name, value);
    }
  };

  const handleSaveEvent = async () => {
    await addEvent();
    setSelectedEvent(null);
  };

  const selectedKey = formatDate(selectedDate);
  const events = tasks[selectedKey] || [];

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-10 border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-center">Event Calendar</h2>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Calendar */}
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
                      className={`rounded px-1 text-xs font-semibold truncate cursor-pointer ${
                        COLORS[idx % COLORS.length]
                      } shadow`}
                      style={{ maxWidth: 90 }}
                      title={event.title}
                    >
                      {event.title.length > 14
                        ? event.title.slice(0, 14) + "..."
                        : event.title}
                    </div>
                  ))}
                </div>
              );
            }}
            prevLabel={<span className="text-lg">&#60;</span>}
            nextLabel={<span className="text-lg">&#62;</span>}
            navigationLabel={({ label }) => (
              <span className="text-xl font-bold">{label}</span>
            )}
            className="mb-6 w-full border-none rounded-xl shadow-none min-w-[700px]"
            tileClassName={({ date, view }) =>
              [
                "!min-h-[60px] !rounded-lg !p-1",
                view === "month" &&
                formatDate(date) === formatDate(selectedDate)
                  ? "bg-blue-100 border-2 border-blue-400"
                  : "hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-100 focus:text-blue-700",
              ]
                .filter(Boolean)
                .join(" ")
            }
            showNeighboringMonth={false}
            next2Label={null}
            prev2Label={null}
            tileDisabled={() => false}
          />
        </div>

        {/* Event List + Detail */}
        <div className="flex-1 max-w-xs mx-auto">
          <h3 className="font-semibold mb-2 text-gray-700">
            Events for {formatDate(selectedDate)}:
          </h3>
          <ul className="space-y-1">
            {events.length === 0 && (
              <li className="text-gray-400">No events for this day.</li>
            )}
            {events.map((event, idx) => (
              <li
                key={event._id}
                className={`rounded px-2 py-1 text-sm font-medium cursor-pointer ${
                  COLORS[idx % COLORS.length]
                }`}
                onClick={() => setSelectedEvent(event)}
              >
                <div className="font-bold">{event.title}</div>
                <div className="text-xs text-gray-600">{event.description}</div>
                <div className="text-xs text-gray-200">
                  {event.startDate} {event.startTime} - {event.endDate}{" "}
                  {event.endTime}
                </div>
              </li>
            ))}
          </ul>

          {/* Event Detail */}
          {selectedEvent && (
            <div className="mt-4 p-4 border rounded bg-gray-50">
              <h4 className="font-bold text-lg mb-2">Event Details</h4>
              <div className="text-sm text-gray-700">
                <div>
                  <strong>Title:</strong> {selectedEvent.title}
                </div>
                <div>
                  <strong>Description:</strong> {selectedEvent.description}
                </div>
                <div>
                  <strong>Date:</strong> {selectedEvent.startDate} →{" "}
                  {selectedEvent.endDate}
                </div>
                <div>
                  <strong>Time:</strong> {selectedEvent.startTime} →{" "}
                  {selectedEvent.endTime}
                </div>
                <div>
                  <strong>Location:</strong> {selectedEvent.location}
                </div>
                <div>
                  <strong>Client:</strong> {selectedEvent.client}
                </div>
                <div>
                  <strong>Labels:</strong> {selectedEvent.labels}
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  className="px-4 py-1 bg-yellow-400 text-white rounded"
                  onClick={() => {
                    setEventForm(selectedEvent);
                    setModalOpen(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="px-4 py-1 bg-red-500 text-white rounded"
                  onClick={async () => {
                    const confirmed = window.confirm(
                      "Are you sure you want to delete this event?"
                    );
                    if (confirmed) {
                      await deleteEvent(selectedEvent._id);
                      setSelectedEvent(null);
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
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
