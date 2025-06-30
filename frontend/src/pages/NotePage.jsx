import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Plus } from "lucide-react";
import Column from "../components/Column";
import CardModal from "../components/CardModal";
import { useColumnStore } from "../store/useColumnStore";

const App = () => {
  const {
    columns,
    isLoading,
    fetchColumns,
    createColumn,
    updateColumn,
    deleteColumn,
    addCard,
    updateCard,
    deleteCard,
  } = useColumnStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentColumnIndex, setCurrentColumnIndex] = useState(null);
  const [editingCard, setEditingCard] = useState(null);

  useEffect(() => {
    fetchColumns();
  }, [fetchColumns]);

  const moveCard = async (cardToMove, fromColumnIndex, toColumnIndex) => {
    const fromColumn = columns[fromColumnIndex];
    const toColumn = columns[toColumnIndex];
    if (!fromColumn || !toColumn) return;
    const cardId = cardToMove._id || cardToMove.id;
    useColumnStore.setState((state) => {
      const newColumns = [...state.columns];
      newColumns[fromColumnIndex] = {
        ...newColumns[fromColumnIndex],
        cards: newColumns[fromColumnIndex].cards.filter(
          (card) => card.id !== cardToMove.id && card._id !== cardToMove._id
        ),
      };
      newColumns[toColumnIndex] = {
        ...newColumns[toColumnIndex],
        cards: [...newColumns[toColumnIndex].cards, { ...cardToMove }],
      };
      return { columns: newColumns };
    });

    try {
      if (cardId) {
        await deleteCard(fromColumn.id || fromColumn._id, cardId);
        await addCard(toColumn.id || toColumn._id, { ...cardToMove });
      }
    } catch (err) {
      fetchColumns();
    }
  };

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

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50 p-8 font-sans antialiased pt-20">
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            body {
              font-family: 'Inter', sans-serif;
            }
          `}
        </style>
        <div className="flex flex-col md:flex-row gap-6 justify-center items-start">
          {isLoading && columns.length === 0 ? (
            <div className="text-center text-gray-400 text-2xl mt-20 w-full">Loading...</div>
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
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl shadow-lg transition-all duration-200 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            aria-label="Add new column"
          >
            <Plus size={24} />
          </button>
        </div>

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
