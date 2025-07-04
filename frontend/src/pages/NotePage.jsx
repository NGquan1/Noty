import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Plus, Settings } from "lucide-react";
import Column from "../components/Column";
import CardModal from "../components/CardModal";
import Sidebar from "../components/Sidebar";
import ProjectModal from "../components/ProjectModal";
import ProjectSettingsPage from "./ProjectSettingsPage";
import NotesPage from "./NotesPage";
import { useColumnStore } from "../store/useColumnStore";
import { useProjectStore } from "../store/useProjectStore";

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

  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [activePage, setActivePage] = useState("tasks");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentColumnIndex, setCurrentColumnIndex] = useState(null);
  const [editingCard, setEditingCard] = useState(null);
  const [projectModalOpen, setProjectModalOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

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
    setActivePage("tasks");
  };

  const handleProjectDeleted = () => {
    setSelectedProjectId(null);
    setActivePage("tasks");
  };

  const pageList = [
    { key: "tasks", label: "Tasks" },
    { key: "calendar", label: "Calendar" },
    { key: "notes", label: "Notes" },
    { key: "members", label: "Members" },
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
        <div className="flex-1 p-8 pt-20">
          <style>
            {`
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
              body {
                font-family: 'Inter', sans-serif;
              }
            `}
          </style>
          <div className="flex gap-4 mb-6 justify-center items-center">
            {pageList.map((page) => (
              <button
                key={page.key}
                className={`capitalize px-6 py-2 rounded-lg text-lg font-medium shadow transition-colors duration-150 ${
                  activePage === page.key
                    ? "bg-gray-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => setActivePage(page.key)}
              >
                {page.icon} {page.label}
              </button>
            ))}
          </div>
          {activePage === "tasks" && (
            <div className="flex flex-col md:flex-row gap-6 justify-center items-start">
              {isLoading && columns.length === 0 ? (
                <div className="text-center text-gray-400 text-2xl mt-20 w-full">
                  Loading...
                </div>
              ) : columns.length === 0 ? (
                <div className="text-center text-gray-400 text-2xl mt-20 w-full">
                  Create your schedule now
                </div>
              ) : (
                columns.map((column, index) => (
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
                ))
              )}
              <button
                onClick={handleAddColumn}
                className="bg-gray-500 hover:bg-gray-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl shadow-lg transition-all duration-200 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
                aria-label="Add new column"
              >
                <Plus size={24} />
              </button>
            </div>
          )}
          {activePage === "calendar" && (
            <div className="text-center text-gray-400 text-2xl mt-20 w-full">
              Calendar page (coming soon)
            </div>
          )}
          {activePage === "notes" && (
            <NotesPage selectedProjectId={selectedProjectId} />
          )}
          {activePage === "members" && (
            <div className="text-center text-gray-400 text-2xl mt-20 w-full">
              Members page (coming soon)
            </div>
          )}
          {activePage === "settings" && (
            <ProjectSettingsPage
              selectedProjectId={selectedProjectId}
              onProjectDeleted={handleProjectDeleted}
            />
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
