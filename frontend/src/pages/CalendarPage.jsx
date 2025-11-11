import React, { useEffect } from "react";
import Calendar from "react-calendar";
import "../Calendar.css";
import "react-calendar/dist/Calendar.css";
import { CalendarDays } from "lucide-react";
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
    const localDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    setSelectedDate(localDate);
    setSelectedEvent(null);
    setEventForm({
      ...eventForm,
      startDate: formatDate(localDate),
      project: activeProjectId,
    });
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

  const selectedKey = selectedDate ? formatDate(selectedDate) : "";
  const events = tasks[selectedKey] || [];

  return (
    <div className="max-w-6xl mx-auto bg-gradient-to-br from-gray-100 to-white rounded-3xl shadow-2xl p-10 mt-8 border border-gray-200 overflow-y-scroll scrollbar-hide">
      <div className="flex items-center justify-between mb-8">
        {/* Icon + Text */}
        <div className="flex items-center justify-center gap-2 flex-1">
          <CalendarDays className="w-7 h-7 text-primary" />
          <h2 className="text-4xl font-extrabold text-primary drop-shadow">
            Event Calendar
          </h2>
        </div>

        {/* Button */}
        <button
          onClick={() => {
            setSelectedEvent(null);
            setModalOpen(true);
            setEventForm({
              startDate: formatDate(selectedDate),
              project: activeProjectId,
            });
          }}
          className="px-3 py-1 bg-gray-700 text-white rounded-md hover:scale-105 transition-all duration-200 flex items-center gap-1 shadow-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-medium">Add Event</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        <div className="flex-1 min-w-[700px]">
          <Calendar
            value={selectedDate}
            onChange={setSelectedDate}
            onClickDay={handleDayClick}
            locale="en-US"
            formatDay={(locale, date) => date.getDate()}
            formatMonth={(locale, date) =>
              date.toLocaleString("en-US", { month: "long", year: "numeric" })
            }
            formatMonthYear={(locale, date) =>
              date.toLocaleString("en-US", { month: "long", year: "numeric" })
            }
            formatShortWeekday={(locale, date) =>
              date.toLocaleString("en-US", { weekday: "short" })
            }
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
          <div
            className="bg-white rounded-2xl shadow-lg p-6 sticky top-4"
            style={{ maxHeight: "500px", overflowY: "auto" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-xl text-gray-800">
                Events for{" "}
                {selectedDate ? selectedDate.toLocaleDateString("en-CA") : ""}
              </h3>
            </div>
            <div className="space-y-4">
              {events.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto mb-3 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-gray-500 font-medium">
                    No events scheduled
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Click the Add Event button to create one
                  </p>
                </div>
              ) : (
                events.map((event, idx) => (
                  <div
                    key={event._id}
                    onClick={() => setSelectedEvent(event)}
                    className={`rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                      COLORS[idx % COLORS.length]
                    } hover:shadow-lg border border-black/5 hover:scale-[1.02]`}
                    style={{ maxWidth: "100%" }}
                  >
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <h4 className="font-semibold text-gray-800 line-clamp-1">
                        {event.title}
                      </h4>
                      {event.labels && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/80 text-gray-600 border border-gray-200/50">
                          {event.labels}
                        </span>
                      )}
                    </div>
                    {event.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {event.description}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {event.startTime} - {event.endTime}
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {event.location}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

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
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-gray-800">
                        {selectedEvent.title}
                      </h3>
                      {selectedEvent.labels && (
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                          {selectedEvent.labels}
                        </span>
                      )}
                    </div>

                    <div className="space-y-4">
                      {selectedEvent.description && (
                        <div className="bg-gray-50 rounded-lg p-4 text-gray-600">
                          {selectedEvent.description}
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-sm font-medium text-gray-500 mb-1">
                            Start
                          </div>
                          <div className="text-gray-800">
                            {selectedEvent.startDate}
                          </div>
                          <div className="text-gray-600">
                            {selectedEvent.startTime}
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-sm font-medium text-gray-500 mb-1">
                            End
                          </div>
                          <div className="text-gray-800">
                            {selectedEvent.endDate}
                          </div>
                          <div className="text-gray-600">
                            {selectedEvent.endTime}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {selectedEvent.location && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            {selectedEvent.location}
                          </div>
                        )}

                        {selectedEvent.user?.fullName && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            {selectedEvent.user.fullName}
                          </div>
                        )}

                        {selectedEvent.client && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                              />
                            </svg>
                            {selectedEvent.client}
                          </div>
                        )}
                      </div>
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
