import React, { useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useCalendarStore } from "../store/useCalendarStore";
import { AnimatePresence, motion } from "framer-motion";
import EventModalForm from "../components/EventModal";
import toast from "react-hot-toast";

const CalendarPage = ({ projectId }) => {
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
    currentProjectId,
    setCurrentProject,
  } = useCalendarStore();

  const activeProjectId = projectId || currentProjectId;

  useEffect(() => {
    if (activeProjectId) {
      setCurrentProject(activeProjectId);
      loadEvents(activeProjectId);
    }
  }, [activeProjectId]);

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setModalOpen(true);
    setEventForm({ ...eventForm, startDate: formatDate(date), project: activeProjectId });
  };

  const handleFormChange = (e) => {
    const { name, value, type, files } = e.target;
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
    loadEvents(activeProjectId);
  };

  const selectedKey = formatDate(selectedDate);
  const events = tasks[selectedKey] || [];

  return (
    <div className="max-w-6xl mx-auto bg-gradient-to-br from-gray-100 to-white rounded-3xl shadow-2xl p-10 mt-8 border border-gray-200 overflow-y-scroll scrollbar-hide">
      <h2 className="text-4xl font-extrabold mb-8 text-center text-primary drop-shadow">Event Calendar</h2>
      <div className="flex flex-col md:flex-row gap-10">
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
                  ? "bg-black-100 border-2 border-black-400"
                  : "hover:bg-gray-50 hover:text-gray-700 focus:bg-gray-100 focus:text-gray-700",
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

        <div className="flex-1 max-w-xs mx-auto">
          <h3 className="font-bold mb-4 text-lg text-primary">Events for {formatDate(selectedDate)}:</h3>
          <ul className="space-y-3">
            {events.length === 0 && (
              <li className="text-gray-400 italic text-center py-6 select-none bg-gray-100 rounded-xl shadow-inner">No events for this day.</li>
            )}
            {events.map((event, idx) => (
              <li
                key={event._id}
                className={`rounded-2xl px-5 py-4 text-base font-medium cursor-pointer shadow-lg border-2 transition-all duration-150 group ${
                  COLORS[idx % COLORS.length]
                } hover:scale-[1.03] hover:shadow-2xl`}
                onClick={() => setSelectedEvent(event)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-lg truncate">{event.title}</span>
                  <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-white/80 text-primary border border-primary/30 shadow-sm">{event.labels || 'Event'}</span>
                </div>
                <div className="text-sm text-gray-600 mb-1 truncate">{event.description}</div>
                <div className="text-xs text-gray-500 flex gap-2 items-center">
                  <span>🗓 {event.startDate} {event.startTime} - {event.endDate} {event.endTime}</span>
                  {event.user?.fullName && <span className="ml-2">👤 {event.user.fullName}</span>}
                </div>
              </li>
            ))}
          </ul>

          <AnimatePresence>
            {selectedEvent && (
              <>
                <motion.div
                  className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedEvent(null)}
                />

                <motion.div
                  className="fixed inset-0 z-50 flex items-center justify-center"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative z-50">
                    <h3 className="text-xl font-bold mb-2">
                      {selectedEvent.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {selectedEvent.description}
                    </p>
                    <div className="text-sm text-gray-700 space-y-1">
                      <div>
                        👤 <strong>Created by:</strong> {selectedEvent.user?.fullName || 'Unknown'}
                      </div>
                      <div>
                        📅 <strong>Date:</strong> {selectedEvent.startDate} →{" "}
                        {selectedEvent.endDate}
                      </div>
                      <div>
                        🕒 <strong>Time:</strong> {selectedEvent.startTime} -{" "}
                        {selectedEvent.endTime}
                      </div>
                      {selectedEvent.location && (
                        <div>
                          📍 <strong>Location:</strong> {selectedEvent.location}
                        </div>
                      )}
                      {selectedEvent.client && (
                        <div>
                          👤 <strong>Client:</strong> {selectedEvent.client}
                        </div>
                      )}
                      {selectedEvent.labels && (
                        <div>
                          🏷 <strong>Labels:</strong> {selectedEvent.labels}
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        className="text-sm px-4 py-1 rounded border border-gray-300 hover:bg-gray-100"
                        onClick={() => setSelectedEvent(null)}
                      >
                        Close
                      </button>
                      <button
                        className="text-sm px-4 py-1 rounded bg-yellow-400 text-white hover:bg-yellow-500"
                        onClick={() => {
                          setEventForm(selectedEvent);
                          setModalOpen(true);
                          setSelectedEvent(null);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="text-sm px-4 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                        onClick={() => {
                          toast(
                            (t) => (
                              <span className="flex flex-col items-start gap-2">
                                <span>
                                  Are you sure you want to delete this event?
                                </span>
                                <div className="flex gap-2">
                                  <button
                                    onClick={async () => {
                                      await deleteEvent(selectedEvent._id);
                                      setSelectedEvent(null);
                                      toast.dismiss(t.id);
                                      toast.success("Event deleted");
                                    }}
                                    className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
                                  >
                                    Delete
                                  </button>
                                  <button
                                    onClick={() => toast.dismiss(t.id)}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm px-3 py-1 rounded"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </span>
                            ),
                            {
                              duration: 10000,
                            }
                          );
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {modalOpen && (
        <EventModalForm
          eventForm={eventForm}
          handleFormChange={handleFormChange}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveEvent}
        />
      )}
    </div>
  );
};

export default CalendarPage;
