import { create } from "zustand";
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true,
});

const COLORS = [
  "bg-sky-500 text-white",
  "bg-rose-300 text-white",
  "bg-amber-300 text-white",
  "bg-emerald-400 text-white",
  "bg-indigo-400 text-white",
  "bg-cyan-400 text-white",
  "bg-lime-400 text-white",
  "bg-fuchsia-300 text-white",
];

const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().slice(0, 10);
};

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

export const useCalendarStore = create((set, get) => ({
  selectedDate: new Date(),
  modalOpen: false,
  tasks: {},
  eventForm: defaultEvent(formatDate(new Date())),
  selectedEvent: null,
  isLoading: false,
  currentProjectId: null,

  setCurrentProject: (projectId) => set({ currentProjectId: projectId }),

  setSelectedDate: (date) => {
    const { currentProjectId } = get();
    set({
      selectedDate: date,
      eventForm: defaultEvent(formatDate(date), currentProjectId),
      selectedEvent: null,
    });
  },

  setModalOpen: (val) => set({ modalOpen: val }),

  setEventForm: (form) => set({ eventForm: form }),

  setSelectedEvent: (event) => set({ selectedEvent: event }),

  updateEventForm: (key, value) => {
    const current = get().eventForm;
    if (key === "shareWith") {
      set({
        eventForm: {
          ...current,
          shareWith: current.shareWith.includes(value)
            ? current.shareWith.filter((v) => v !== value)
            : [...current.shareWith, value],
        },
      });
    } else {
      set({
        eventForm: {
          ...current,
          [key]: value,
        },
      });
    }
  },

  loadEvents: async (projectId) => {
    set({ isLoading: true });
    try {
      const res = await API.get(`/calendar?projectId=${projectId}`);
      const rawEvents = res.data;
      const grouped = {};
      rawEvents.forEach((event) => {
        const key = formatDate(event.startDate);
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(event);
      });
      set({ tasks: grouped });
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  addEvent: async () => {
    const { selectedDate, eventForm, tasks, currentProjectId } = get();
    const key = formatDate(selectedDate);
    try {
      let newEvent;
      const eventData = { ...eventForm, project: currentProjectId };
      if (eventForm._id) {
        const res = await API.put(`/calendar/${eventForm._id}`, eventData);
        newEvent = res.data;
      } else {
        const res = await API.post("/calendar", eventData);
        newEvent = res.data;
      }
      const updatedTasks = { ...tasks };
      updatedTasks[key] = [...(updatedTasks[key] || [])];
      updatedTasks[key] = updatedTasks[key].filter(
        (e) => e._id !== newEvent._id
      );
      updatedTasks[key].push(newEvent);
      set({
        tasks: updatedTasks,
        modalOpen: false,
        selectedEvent: null,
        eventForm: defaultEvent(key, currentProjectId),
      });
    } catch (err) {
      console.error("Failed to add/update event:", err);
    }
  },

  deleteEvent: async (eventId) => {
    try {
      await API.delete(`/events/${eventId}`);

      const tasks = get().tasks;
      const updatedTasks = {};

      Object.keys(tasks).forEach((dateKey) => {
        updatedTasks[dateKey] = tasks[dateKey].filter(
          (e) => e._id !== eventId && e.id !== eventId
        );
      });

      set({ tasks: updatedTasks });
    } catch (err) {
      console.error("Failed to delete event:", err);
    }
  },

  getEventsForDate: (date) => {
    const key = formatDate(date);
    return get().tasks[key] || [];
  },

  COLORS,
  formatDate,
}));
