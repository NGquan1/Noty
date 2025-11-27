import React, { useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import { Plus, Trash2 } from "lucide-react";
import Card from "./Card";

const ItemTypes = { CARD: "card" };

const Column = ({
  column,
  columnIndex,
  columns,
  moveCard,
  moveCardOnServer,
  onAddCard,
  onEditCard,
  updateColumnTitle,
  onDeleteColumn,
  onDeleteCard,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(column.title);

  useEffect(() => {
    setNewTitle(column.title);
  }, [column.title]);

  const handleTitleChange = (e) => {
    setNewTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    if (newTitle.trim() !== "" && newTitle !== column.title) {
      updateColumnTitle(column.id, newTitle.trim());
    } else {
      setNewTitle(column.title);
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") e.target.blur();
  };

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemTypes.CARD,
    drop: (item, monitor) => {
      const { card, fromColumnIndex, fromCardIndex } = item;

      if (fromColumnIndex !== columnIndex) {
        const toCardIndex = column.cards.length;

        moveCard(fromColumnIndex, fromCardIndex, columnIndex, toCardIndex);
        moveCardOnServer(card.id, fromColumnIndex, columnIndex, toCardIndex);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`bg-gray-200/90 p-4 rounded-lg shadow-inner w-full md:w-1/3 flex flex-col min-h-[300px] transition-all ${
        isOver ? "ring-2 ring-blue-400" : ""
      }`}
    >
      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-grow flex items-center gap-2">
          {isEditingTitle ? (
            <input
              type="text"
              value={newTitle}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              className="text-xl font-bold text-gray-800 bg-transparent border-b-2 border-blue-400 focus:outline-none w-full"
              autoFocus
            />
          ) : (
            <h3
              className="text-xl font-bold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => setIsEditingTitle(true)}
            >
              {column.title}
            </h3>
          )}
          <button
            onClick={() => onDeleteColumn(column.id)}
            className="text-gray-500 hover:text-red-600 p-1 rounded-full hover:bg-red-100 transition-colors"
            aria-label="Delete column"
          >
            <Trash2 size={18} />
          </button>
        </div>
        <button
          onClick={() => onAddCard(columnIndex)}
          className="bg-gray-300 hover:bg-gray-400/50 rounded-full w-8 h-8 flex items-center justify-center text-gray-700 shadow transition-all duration-200 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
          aria-label={`Add to column ${column.title}`}
        >
          <Plus size={18} />
        </button>
      </div>

      {/* ===== CARD LIST ===== */}
      <div className="flex-grow max-h-[70vh] overflow-y-auto p-2 custom-scrollbar">
        {column.cards.map((card, index) => (
          <Card
            key={card.id}
            card={card}
            cardIndex={index}
            columnIndex={columnIndex}
            columns={columns}
            moveCard={moveCard}
            moveCardOnServer={moveCardOnServer}
            onEdit={onEditCard}
            onDelete={onDeleteCard}
          />
        ))}
        {column.cards.length === 0 && (
          <div
            className={`text-center text-gray-500 italic p-3 rounded ${
              isOver ? "bg-blue-50 border border-blue-300" : ""
            }`}
          >
            Drop a card here
          </div>
        )}
      </div>
    </div>
  );
};

export default Column;
