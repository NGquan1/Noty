
import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Pencil, Trash2, UserCircle2 } from "lucide-react";

const ItemTypes = {
  CARD: "card",
};

const statusBadge = {
  "to-do": {
    label: "To Do",
    color: "bg-blue-100 text-blue-700 border-blue-300",
    bg: "bg-blue-400/70"
  },
  "ongoing": {
    label: "Ongoing",
    color: "bg-amber-100 text-amber-800 border-amber-300",
    bg: "bg-amber-300"
  },
  "finished": {
    label: "Finished",
    color: "bg-emerald-100 text-emerald-800 border-emerald-300",
    bg: "bg-emerald-300"
  },
};

const Card = ({ card, columnIndex, moveCard, onEdit, onDelete, cardIndex }) => {
  const ref = useRef(null);
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: { id: card.id, columnIndex, card, cardIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemTypes.CARD,
    hover(item, monitor) {
      if (!ref.current) return;
      const dragIndex = item.cardIndex;
      const hoverIndex = cardIndex;
      const sourceCol = item.columnIndex;
      const targetCol = columnIndex;
      if (dragIndex === hoverIndex && sourceCol === targetCol) return;
      const targetPos = dragIndex < hoverIndex ? hoverIndex + 1 : hoverIndex;
      moveCard(item.card, sourceCol, targetCol, dragIndex, targetPos);
      item.cardIndex = targetPos;
      item.columnIndex = targetCol;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  });

  drag(drop(ref));
  const opacity = isDragging ? 0.2 : 1;
  const maxTasksToShow = 3;

  return (
    <div
      ref={ref}
      className={`group p-5 rounded-2xl shadow-xl mb-4 cursor-grab active:cursor-grabbing relative  transition-all duration-200 ${
        statusBadge[card.status]?.bg || "bg-white"
      } hover:scale-[1.025] hover:shadow-2xl
        ${isDragging ? 'ring-4 ring-primary/30 z-20' : ''}
        ${isOver && canDrop ? 'ring-4 ring-primary/60 z-30 scale-[1.03]' : ''}`}
      style={{ opacity }}
    >
      <div className="mb-2">
        <h4 className="font-semibold text-gray-800 truncate">
          {card.member}
        </h4>
        {card.user && card.user.fullName && (
          <span className="text-xs text-gray-500 block truncate">By: {card.user.fullName}</span>
        )}
      </div>
      <ul className="list-disc list-inside text-gray-700 mb-2">
        {card.tasks.slice(0, maxTasksToShow).map((task, index) => (
          <li key={index}>{task}</li>
        ))}
        {card.tasks.length > maxTasksToShow && (
          <li className="text-gray-400 italic">
            ... ({card.tasks.length - maxTasksToShow} more)
          </li>
        )}
      </ul>
      <div className="flex justify-between items-end mt-4">
        <div></div>
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
              statusBadge[card.status]?.color || "bg-gray-100 text-gray-500 border-gray-300"
            }`}
          >
            {statusBadge[card.status]?.label || card.status}
          </span>
          <button
            onClick={() => onEdit(card, columnIndex)}
            className="text-gray-500 hover:text-blue-600 p-1 rounded-full hover:bg-blue-100 transition-colors"
            aria-label="Edit card"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={() => onDelete(card.id, columnIndex)}
            className="text-gray-500 hover:text-red-600 p-1 rounded-full hover:bg-red-100 transition-colors"
            aria-label="Delete card"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
