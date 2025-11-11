import { create } from "zustand";
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const COLORS = [
  "bg-gradient-to-r from-[#FFB3B3] to-[#FF7A7A] text-white", // đỏ pastel vừa
  "bg-gradient-to-r from-[#81E6D9] to-[#14B8A6] text-white", // xanh lá vừa
  "bg-gradient-to-r from-[#A5B4FC] to-[#6366F1] text-white", // xanh dương vừa
  "bg-gradient-to-r from-[#FDE68A] to-[#FCD34D] text-black", // vàng vừa
  "bg-gradient-to-r from-[#C4B5FD] to-[#A78BFA] text-white", // tím pastel vừa
  "bg-gradient-to-r from-[#F9A8D4] to-[#F472B6] text-white", // hồng vừa
  "bg-gradient-to-r from-[#5EEAD4] to-[#14B8A6] text-white", // teal vừa
  "bg-gradient-to-r from-[#D8B4FE] to-[#C084FC] text-white",
];

const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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
      eventForm: defaultEvent(formatDate(date)),
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
      const eventKey = formatDate(newEvent.startDate);
      const updatedTasks = { ...tasks };
      Object.keys(updatedTasks).forEach((dateKey) => {
        updatedTasks[dateKey] = updatedTasks[dateKey].filter(
          (e) => e._id !== newEvent._id
        );
      });
      if (!updatedTasks[eventKey]) updatedTasks[eventKey] = [];
      updatedTasks[eventKey].push(newEvent);
      set({
        tasks: updatedTasks,
        modalOpen: false,
        selectedEvent: null,
        eventForm: defaultEvent(eventKey),
      });
    } catch (err) {
      console.error("Failed to add/update event:", err);
    }
  },

  deleteEvent: async (eventId) => {
    try {
      await API.delete(`/calendar/${eventId}`);

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
