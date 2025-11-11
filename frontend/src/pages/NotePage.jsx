import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  Plus,
  Settings,
  FolderGit2,
  CalendarDays,
  StickyNote,
  Users,
  LayoutList,
  MessageSquare,
} from "lucide-react";

import Column from "../components/Column";
import CardModal from "../components/CardModal";
import Sidebar from "../components/Sidebar";
import ProjectModal from "../components/ProjectModal";
import ProjectSettingsPage from "./ProjectSettingsPage";
import NotesPage from "./NotesPage";
import CalendarPage from "./CalendarPage";
import MembersPage from "./MembersPage";
import AnimatedPageTransition from "../components/AnimatedPageTransition";
import ChatWindow from "../components/ChatWindow";

import { useColumnStore } from "../store/useColumnStore";
import { useProjectStore } from "../store/useProjectStore";
import { useCalendarStore } from "../store/useCalendarStore";

const App = () => {
  const {
    isLoading,
    fetchColumns,
    createColumn,
    updateColumn,
    deleteColumn,
    addCard,
    updateCard,
    deleteCard,
    columns,
    moveCardInClient,
    moveCardOnServer,
  } = useColumnStore();
  const { projects, fetchProjects, createProject } = useProjectStore();
  const { setCurrentProject } = useCalendarStore();

  const { currentProjectId, setCurrentProjectId } = useProjectStore();
  const [selectedProjectId, setSelectedProjectId] = useState(currentProjectId);
  const [activePage, setActivePage] = useState("tasks");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentColumnIndex, setCurrentColumnIndex] = useState(null);
  const [editingCard, setEditingCard] = useState(null);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (currentProjectId && currentProjectId !== selectedProjectId) {
      setSelectedProjectId(currentProjectId);
    }
  }, [currentProjectId]);

  useEffect(() => {
    if (selectedProjectId) fetchColumns(selectedProjectId);
  }, [fetchColumns, selectedProjectId]);

  const handleAddCard = (columnIndex) => {
    setCurrentColumnIndex(columnIndex);
    setEditingCard(null);
    setIsModalOpen(true);
  };

  const handleEditCard = (card, columnIndex) => {
    setCurrentColumnIndex(columnIndex);
    setEditingCard(card);
    setIsModalOpen(true);
  };

  const handleSaveCard = async (cardData, columnIndex, originalCardId) => {
    const column = columns[columnIndex];
    const cardId = cardData._id || cardData.id || originalCardId;
    if (originalCardId) {
      await updateCard(column.id || column._id, cardId, cardData);
    } else {
      await addCard(column.id || column._id, cardData);
    }
    setIsModalOpen(false);
    setEditingCard(null);
  };

  const handleAddColumn = async () => {
    await createColumn("New column");
  };

  const handleUpdateColumnTitle = async (columnId, newTitle) => {
    await updateColumn(columnId, newTitle);
  };

  const handleDeleteColumn = async (columnId) => {
    await deleteColumn(columnId);
  };

  const handleDeleteCard = async (cardId, columnIndex) => {
    const column = columns[columnIndex];
    const realId = cardId?._id || cardId?.id || cardId;
    await deleteCard(column.id || column._id, realId);
  };

  const handleAddProject = async (data) => {
    const newProject = await createProject(data);
    setProjectModalOpen(false);
    if (newProject && (newProject._id || newProject.id)) {
      setSelectedProjectId(newProject._id || newProject.id);
      setCurrentProject(newProject._id || newProject.id);
    } else {
      await fetchProjects();
      const lastProject = useProjectStore.getState().projects.slice(-1)[0];
      if (lastProject) {
        setSelectedProjectId(lastProject._id || lastProject.id);
        setCurrentProject(lastProject._id || lastProject.id);
      }
    }
  };

  const handleSelectProject = (id) => {
    setSelectedProjectId(id);
    setCurrentProject(id);
    setActivePage("tasks");
  };

  const handleProjectDeleted = () => {
    setSelectedProjectId(null);
    setActivePage("tasks");
  };

  const pageList = [
    {
      key: "tasks",
      label: "Tasks",
      icon: <LayoutList size={16} className="inline mr-1" />,
    },
    {
      key: "calendar",
      label: "Calendar",
      icon: <CalendarDays size={16} className="inline mr-1" />,
    },
    {
      key: "notes",
      label: "Notes",
      icon: <StickyNote size={16} className="inline mr-1" />,
    },
    {
      key: "members",
      label: "Members",
      icon: <Users size={16} className="inline mr-1" />,
    },
    {
      key: "settings",
      label: "Settings",
      icon: <Settings size={16} className="inline mr-1" />,
    },
  ];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex min-h-screen bg-gray-50 font-sans antialiased overflow-hidden relative">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
          {/* Grid pattern */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
              linear-gradient(to right, #e5e7eb 1px, transparent 1px),
              linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
            `,
              backgroundSize: "80px 80px",
            }}
          ></div>

          {/* Subtle gradient orbs */}
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-br from-violet-200/30 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-1/3 w-80 h-80 bg-gradient-to-tl from-blue-200/30 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-gradient-to-br from-indigo-200/20 to-transparent rounded-full blur-3xl"></div>
        </div>

        <Sidebar
          projects={projects}
          onAddProject={handleAddProject}
          onSelectProject={handleSelectProject}
          selectedProjectId={selectedProjectId}
          pageList={pageList}
          activePage={activePage}
          setActivePage={setActivePage}
        />

        <div className="flex-1 p-8 pt-20 mt-5 relative z-10">
          {!selectedProjectId ? (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)]">
              <div className="w-[480px] max-w-full text-center bg-white/90 backdrop-blur-sm p-14 rounded-3xl shadow-2xl border border-gray-200 flex flex-col items-center gap-8 animate-fade-in relative overflow-hidden">
                {/* Subtle decorative elements */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-violet-100/50 to-transparent rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-blue-100/50 to-transparent rounded-full blur-2xl"></div>

                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-300/20 to-blue-300/20 rounded-full blur-xl animate-pulse"></div>
                  <FolderGit2 className="w-24 h-24 text-violet-600 relative drop-shadow-lg" />
                </div>

                <div className="relative z-10">
                  <h2 className="text-4xl font-black text-gray-800 mb-3 tracking-tight">
                    Welcome to Noty
                  </h2>
                  <p className="text-lg text-gray-600 mb-2 font-semibold">
                    Get started by creating your first project
                  </p>
                </div>

                <button
                  onClick={() => setProjectModalOpen(true)}
                  className="relative flex items-center justify-center gap-3 px-8 py-4 bg-gray-800 hover:bg-gray-900 text-white rounded-2xl text-lg font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 mx-auto focus:outline-none focus:ring-4 focus:ring-gray-400/40 z-10"
                >
                  <Plus className="w-6 h-6" />
                  <span>Create New Project</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex gap-4 mb-10 justify-center items-center flex-wrap">
                {pageList.map((page) => (
                  <button
                    key={page.key}
                    className={`capitalize flex items-center gap-2 px-8 py-3.5 rounded-2xl text-base font-bold shadow-lg border-2 transition-all duration-300 focus:outline-none relative overflow-hidden group ${
                      activePage === page.key
                        ? "bg-gray-800 border-gray-900 text-white scale-105 shadow-xl"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700 hover:scale-105 hover:shadow-xl"
                    }`}
                    style={{ minWidth: 140 }}
                    onClick={() => setActivePage(page.key)}
                  >
                    {activePage !== page.key && (
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-100/0 to-blue-100/0 group-hover:from-violet-100/50 group-hover:to-blue-100/50 transition-all duration-300"></div>
                    )}
                    <span className="text-xl relative z-10">{page.icon}</span>
                    <span className="relative z-10">{page.label}</span>
                  </button>
                ))}
              </div>

              <AnimatedPageTransition pageKey={activePage}>
                {activePage === "tasks" && (
                  <div className="flex flex-col md:flex-row gap-6 justify-center items-start">
                    {isLoading ? (
                      <div className="text-center text-gray-400 text-2xl mt-20 w-full">
                        Loading...
                      </div>
                    ) : (
                      <>
                        {columns.map((column, index) => (
                          <Column
                            key={column.id || column._id}
                            column={column}
                            columnIndex={index}
                            columns={columns}
                            moveCard={moveCardInClient}
                            moveCardOnServer={moveCardOnServer}
                            onAddCard={handleAddCard}
                            onEditCard={handleEditCard}
                            updateColumnTitle={handleUpdateColumnTitle}
                            onDeleteColumn={handleDeleteColumn}
                            onDeleteCard={handleDeleteCard}
                          />
                        ))}
                        <button
                          onClick={handleAddColumn}
                          className="bg-gray-700 hover:bg-gray-800 text-white rounded-2xl w-14 h-14 flex items-center justify-center text-xl shadow-xl transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-gray-500/40"
                          aria-label="Add new column"
                        >
                          <Plus size={28} />
                        </button>
                      </>
                    )}
                  </div>
                )}
                {activePage === "calendar" && (
                  <CalendarPage projectId={selectedProjectId} />
                )}
                {activePage === "notes" && (
                  <NotesPage selectedProjectId={selectedProjectId} />
                )}
                {activePage === "members" && (
                  <MembersPage projectId={selectedProjectId} />
                )}
                {activePage === "settings" && (
                  <ProjectSettingsPage
                    selectedProjectId={selectedProjectId}
                    onProjectDeleted={handleProjectDeleted}
                  />
                )}
              </AnimatedPageTransition>
            </>
          )}
        </div>

        {/* Chat section */}
        {selectedProjectId && (
          <>
            {!isChatOpen && (
              <button
                onClick={() => setIsChatOpen(true)}
                className="fixed bottom-8 right-8 bg-gray-800 hover:bg-gray-900 text-white rounded-2xl w-16 h-16 flex items-center justify-center shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-gray-500/40 z-50"
                aria-label="Open chat"
              >
                <MessageSquare size={28} />
              </button>
            )}
            <ChatWindow
              isOpen={isChatOpen}
              onClose={() => setIsChatOpen(false)}
              projectId={selectedProjectId}
            />
          </>
        )}

        <CardModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveCard}
          initialCardData={editingCard}
          columnIndex={currentColumnIndex}
        />

        <ProjectModal
          isOpen={projectModalOpen}
          onClose={() => setProjectModalOpen(false)}
          onSave={async (data) => {
            const newProject = await createProject(data);
            setProjectModalOpen(false);
            if (newProject && (newProject._id || newProject.id)) {
              setSelectedProjectId(newProject._id || newProject.id);
              setCurrentProject(newProject._id || newProject.id);
            } else {
              await fetchProjects();
              const lastProject = useProjectStore
                .getState()
                .projects.slice(-1)[0];
              if (lastProject) {
                setSelectedProjectId(lastProject._id || lastProject.id);
                setCurrentProject(lastProject._id || lastProject.id);
              }
            }
          }}
        />
      </div>
    </DndProvider>
  );
};

export default App;
