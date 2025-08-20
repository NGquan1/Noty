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
    moveCard,
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


  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    // Ưu tiên lấy projectId từ store nếu có
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
    await createProject(data);
    setProjectModalOpen(false);
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
          onAddProject={() => setProjectModalOpen(true)}
          onSelectProject={handleSelectProject}
          selectedProjectId={selectedProjectId}
          pageList={pageList}
          activePage={activePage}
          setActivePage={setActivePage}
        />
        <ProjectModal
          isOpen={projectModalOpen}
          onClose={() => setProjectModalOpen(false)}
          onSave={handleAddProject}
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
              <div className="w-96 text-center bg-white p-8 rounded-lg shadow-lg">
                <FolderGit2 className="w-16 h-16 text-gray-400 mb-4 mx-auto" />
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                  Welcome to Noty
                </h2>
                <p className="text-gray-500 mb-8">
                  Get started by creating your first project
                </p>
                <button
                  onClick={() => setProjectModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-primary/90 transition-colors mx-auto"
                >
                  <Plus className="w-5 h-5" />
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
                            moveCard={moveCard}
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
          <CardModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveCard}
            initialCardData={editingCard}
            columnIndex={currentColumnIndex}
          />
        </div>
      </div>
    </DndProvider>
  );
};

export default App;
