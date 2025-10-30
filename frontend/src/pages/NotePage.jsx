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
      <div className="flex min-h-screen bg-gray-50 font-sans antialiased">
        <Sidebar
          projects={projects}
          onAddProject={handleAddProject}
          onSelectProject={handleSelectProject}
          selectedProjectId={selectedProjectId}
          pageList={pageList}
          activePage={activePage}
          setActivePage={setActivePage}
        />
        <div className="flex-1 p-8 pt-20 mt-5">
          <style>
            {`
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
              body {
                font-family: 'Inter', sans-serif;
              }
            `}
          </style>
          {!selectedProjectId ? (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)]">
              <div className="w-[420px] max-w-full text-center bg-gradient-to-br from-primary/5 to-white p-12 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center gap-6 animate-fade-in">
                <FolderGit2 className="w-20 h-20 text-primary/70 mb-2 mx-auto drop-shadow-lg" />
                <h2 className="text-3xl font-extrabold text-primary drop-shadow mb-2 tracking-wide">
                  Welcome to Noty
                </h2>
                <p className="text-lg text-gray-500 mb-4 font-medium">
                  Get started by creating your first project
                </p>
                <button
                  onClick={() => setProjectModalOpen(true)}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-800/90 text-white rounded-2xl text-lg font-bold shadow-lg hover:bg-primary transition-all duration-150 mx-auto focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <Plus className="w-6 h-6" />
                  Create New Project
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex gap-4 mb-8 justify-center items-center">
                {pageList.map((page) => (
                  <button
                    key={page.key}
                    className={`capitalize flex items-center gap-2 px-7 py-3 rounded-2xl text-lg font-semibold shadow-lg border-2 transition-all duration-00 focus:outline-none focus:ring-2 focus:ring-violet-300/60  ${
                      activePage === page.key
                        ? "bg-gray-700/90 border-black-500 text-white scale-[1.07] drop-shadow-lg"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-violet-50 hover:border-violet-400 hover:text-violet-700"
                    }`}
                    style={{ minWidth: 130 }}
                    onClick={() => setActivePage(page.key)}
                  >
                    <span className="text-xl">{page.icon}</span> {page.label}
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
                          className="bg-gray-500 hover:bg-gray-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl shadow-lg transition-all duration-200 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
                          aria-label="Add new column"
                        >
                          <Plus size={24} />
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

        {/* Phần code mới cho Chat */}
        {selectedProjectId && (
          <>
            {!isChatOpen && (
              <button
                onClick={() => setIsChatOpen(true)}
                className="fixed bottom-8 right-8 bg-gray-800/90 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-all duration-200 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/40 z-50"
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
      </div>
    </DndProvider>
  );
};

export default App;
