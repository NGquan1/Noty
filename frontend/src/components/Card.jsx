import React from "react";
import { useDrag } from "react-dnd";
import { Pencil, Trash2 } from "lucide-react";

const ItemTypes = {
  CARD: "card",
};

const Card = ({ card, columnIndex, moveCard, onEdit, onDelete }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: { id: card.id, columnIndex, card },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;
  const maxTasksToShow = 3;

  return (
    <div
      ref={drag}
      className="bg-white p-4 rounded-lg shadow-md mb-3 cursor-grab active:cursor-grabbing relative"
      style={{ opacity }}
    >
      <h4 className="font-semibold text-gray-800 mb-1">{card.member}</h4>
      <ul className="list-disc list-inside text-gray-700">
        {card.tasks.slice(0, maxTasksToShow).map((task, index) => (
          <li key={index}>{task}</li>
        ))}
        {card.tasks.length > maxTasksToShow && (
          <li className="text-gray-500">
            ... ({card.tasks.length - maxTasksToShow} more)
          </li>
        )}
      </ul>
      <div className="absolute top-2 right-2 flex gap-1">
        <button
          onClick={() => onEdit(card, columnIndex)}
          className="text-gray-500 hover:text-blue-600 p-1 rounded-full hover:bg-blue-100 transition-colors"
          aria-label="Edit card"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={() => onDelete(card.id, columnIndex)}
          className="text-gray-500 hover:text-red-600 p-1 rounded-full hover:bg-red-100 transition-colors"
          aria-label="Delete card"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default Card;
