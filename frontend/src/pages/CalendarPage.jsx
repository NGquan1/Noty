import React, { useEffect } from "react";
import Calendar from "react-calendar";
import "../Calendar.css";
import "react-calendar/dist/Calendar.css";
import { CalendarDays, Plus, Sparkles } from "lucide-react";
import { useCalendarStore } from "../store/useCalendarStore";
import { AnimatePresence, motion } from "framer-motion";
import EventModalForm from "../components/EventModal";
import toast from "react-hot-toast";
import RemoteCursor from "../components/RemoteCursor";
import { useChatStore } from "../store/useChatStore";

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

  const { joinProject, leaveProject } = useChatStore();

  useEffect(() => {
    if (activeProjectId) {
      joinProject(activeProjectId);
    }

    return () => {
      if (activeProjectId) {
        leaveProject(activeProjectId);
      }
    };
  }, [activeProjectId, joinProject, leaveProject]);

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
    <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-10 mt-8 border border-gray-200 overflow-y-scroll scrollbar-hide relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl opacity-40">
        <div className="absolute top-10 right-10 w-32 h-32 bg-violet-200/30 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-indigo-200/20 rounded-full blur-2xl"></div>

        <div className="absolute top-20 right-1/4 w-16 h-16 border-2 border-violet-200/20 rounded-lg rotate-12"></div>
        <div className="absolute bottom-40 right-20 w-12 h-12 border-2 border-blue-200/20 rounded-full"></div>
      </div>

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-violet-500/10 to-blue-500/10 rounded-2xl backdrop-blur-sm border border-violet-200/30">
            <CalendarDays className="w-7 h-7 text-violet-600" />
          </div>
          <div>
            <h2 className="text-4xl font-extrabold text-gray-800">
              Event Calendar
            </h2>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Manage your events and schedule
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setSelectedEvent(null);
            setModalOpen(true);
            setEventForm({
              startDate: formatDate(selectedDate),
              project: activeProjectId,
            });
          }}
          className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-violet-700 text-white rounded-xl hover:scale-105 hover:shadow-lg hover:shadow-violet-500/30 transition-all duration-200 flex items-center gap-2 font-semibold relative group overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-violet-700 to-violet-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <Plus className="w-5 h-5 relative z-10" />
          <span className="relative z-10">Add Event</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-10 relative z-10">
        <div className="flex-1 min-w-[700px]">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200/50">
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
                        className={`rounded-lg px-1.5 py-0.5 text-xs font-semibold truncate cursor-pointer ${
                          COLORS[idx % COLORS.length]
                        } shadow-sm hover:shadow-md transition-shadow`}
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
              prevLabel={<span className="text-lg font-bold">‹</span>}
              nextLabel={<span className="text-lg font-bold">›</span>}
              navigationLabel={({ label }) => (
                <span className="text-xl font-bold text-gray-800">{label}</span>
              )}
              className="mb-6 w-full border-none rounded-xl shadow-none min-w-[700px]"
              tileClassName={({ date, view }) =>
                [
                  "!min-h-[60px] !rounded-lg !p-1 transition-all duration-100",
                  view === "month" &&
                  formatDate(date) === formatDate(selectedDate)
                    ? "border-2 border-violet-500"
                    : "hover:bg-violet-50 focus:bg-violet-100 focus:text-gray-700",
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
        </div>

        <div className="flex-1 max-w-xs mx-auto">
          <div
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 top-4 border border-gray-200/50 relative overflow-hidden"
            style={{ maxHeight: "500px", overflowY: "auto" }}
          >
            {/* Decorative corner */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-violet-200/20 to-transparent rounded-bl-full"></div>

            <div className="flex items-center justify-between mb-6 relative z-10">
              <div>
                <h3 className="font-bold text-xl text-gray-800">Events</h3>
                <p className="text-sm text-gray-500">
                  {selectedDate ? selectedDate.toLocaleDateString("en-CA") : ""}
                </p>
              </div>
              <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center">
                <span className="text-violet-600 font-bold">
                  {events.length}
                </span>
              </div>
            </div>

            <div className="space-y-3 relative z-10">
              {events.length === 0 ? (
                <div className="text-center py-10 bg-gradient-to-br from-gray-50 to-violet-50/30 rounded-xl border-2 border-dashed border-gray-200">
                  <div className="w-16 h-16 mx-auto mb-3 bg-violet-100 rounded-full flex items-center justify-center">
                    <CalendarDays className="w-8 h-8 text-violet-400" />
                  </div>
                  <p className="text-gray-600 font-semibold">
                    No events scheduled
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Click Add Event to create one
                  </p>
                </div>
              ) : (
                events.map((event, idx) => (
                  <div
                    key={event._id}
                    onClick={() => setSelectedEvent(event)}
                    className={`rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                      COLORS[idx % COLORS.length]
                    } hover:shadow-lg border-2 border-transparent hover:border-violet-300 hover:scale-[1.02] relative overflow-hidden group`}
                    style={{ maxWidth: "100%" }}
                  >
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all"></div>

                    <div className="flex items-center justify-between gap-3 mb-2 relative z-10">
                      <h4 className="font-bold text-gray-800 line-clamp-1 flex items-center gap-2">
                        <span className="w-2 h-2 bg-violet-600 rounded-full"></span>
                        {event.title}
                      </h4>
                      {event.labels && (
                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-white/90 text-violet-600 border border-violet-200 shadow-sm">
                          {event.labels}
                        </span>
                      )}
                    </div>
                    {event.description && (
                      <p className="text-sm text-gray-700 mb-3 line-clamp-2 relative z-10">
                        {event.description}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 relative z-10">
                      <div className="flex items-center gap-1 bg-white/60 px-2 py-1 rounded-lg">
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
                        <span className="font-semibold">
                          {event.startTime} - {event.endTime}
                        </span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-1 bg-white/60 px-2 py-1 rounded-lg">
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
                          <span className="font-semibold">
                            {event.location}
                          </span>
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
                  className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedEvent(null)}
                />

                <motion.div
                  className="fixed inset-0 z-50 flex items-center justify-center p-4"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative z-50 border border-gray-200">
                    {/* Decorative corner */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-100/50 to-transparent rounded-bl-full"></div>

                    <div className="flex items-center justify-between mb-6 relative z-10">
                      <h3 className="text-2xl font-black text-gray-800">
                        {selectedEvent.title}
                      </h3>
                      {selectedEvent.labels && (
                        <span className="px-3 py-1.5 rounded-xl text-sm font-bold bg-violet-100 text-violet-700 border border-violet-200">
                          {selectedEvent.labels}
                        </span>
                      )}
                    </div>

                    <div className="space-y-4 relative z-10">
                      {selectedEvent.description && (
                        <div className="bg-gradient-to-br from-gray-50 to-violet-50/30 rounded-xl p-4 text-gray-700 border border-gray-200/50">
                          {selectedEvent.description}
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50/50 rounded-xl p-4 border border-green-200/50">
                          <div className="text-sm font-bold text-green-700 mb-2">
                            Start
                          </div>
                          <div className="text-gray-800 font-semibold">
                            {selectedEvent.startDate}
                          </div>
                          <div className="text-gray-600 text-sm mt-1">
                            {selectedEvent.startTime}
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-red-50 to-rose-50/50 rounded-xl p-4 border border-red-200/50">
                          <div className="text-sm font-bold text-red-700 mb-2">
                            End
                          </div>
                          <div className="text-gray-800 font-semibold">
                            {selectedEvent.endDate}
                          </div>
                          <div className="text-gray-600 text-sm mt-1">
                            {selectedEvent.endTime}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 bg-gray-50 rounded-xl p-4 border border-gray-200/50">
                        {selectedEvent.location && (
                          <div className="flex items-center gap-3 text-gray-700">
                            <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-violet-600"
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
                            </div>
                            <span className="font-semibold">
                              {selectedEvent.location}
                            </span>
                          </div>
                        )}

                        {selectedEvent.user?.fullName && (
                          <div className="flex items-center gap-3 text-gray-700">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-blue-600"
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
                            </div>
                            <span className="font-semibold">
                              {selectedEvent.user.fullName}
                            </span>
                          </div>
                        )}

                        {selectedEvent.client && (
                          <div className="flex items-center gap-3 text-gray-700">
                            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-indigo-600"
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
                            </div>
                            <span className="font-semibold">
                              {selectedEvent.client}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6 relative z-10">
                      <button
                        className="px-4 py-2 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 hover:scale-105 transition-all"
                        onClick={() => setSelectedEvent(null)}
                      >
                        Close
                      </button>
                      <button
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold hover:shadow-lg hover:shadow-yellow-500/30 hover:scale-105 transition-all"
                        onClick={() => {
                          setEventForm(selectedEvent);
                          setModalOpen(true);
                          setSelectedEvent(null);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:shadow-lg hover:shadow-red-500/30 hover:scale-105 transition-all"
                        onClick={() => {
                          toast(
                            (t) => (
                              <span className="flex flex-col items-start gap-3 p-2">
                                <span className="font-semibold text-gray-800">
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
                                    className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg font-semibold"
                                  >
                                    Delete
                                  </button>
                                  <button
                                    onClick={() => toast.dismiss(t.id)}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm px-4 py-2 rounded-lg font-semibold"
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

      {/* Remote cursor component - renders when in a project */}
      {activeProjectId && <RemoteCursor projectId={activeProjectId} />}
    </div>
  );
};

export default CalendarPage;
