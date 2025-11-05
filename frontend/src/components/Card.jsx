import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Pencil, Trash2 } from "lucide-react";

const ItemTypes = {
  CARD: "card",
};

export const statusBadge = {
  "to-do": {
    label: "To-Do",
    color: "bg-blue-100 text-blue-700 border-blue-300",
    bg: "bg-blue-400/70",
  },
  ongoing: {
    label: "Ongoing",
    color: "bg-amber-100 text-amber-800 border-amber-300",
    bg: "bg-amber-300",
  },
  finished: {
    label: "Finished",
    color: "bg-emerald-100 text-emerald-800 border-emerald-300",
    bg: "bg-emerald-300",
  },
  urgent: {
    label: "Urgent",
    color: "bg-red-100 text-red-700 border-red-300",
    bg: "bg-red-400/80",
  },
  important: {
    label: "Important",
    color: "bg-orange-100 text-orange-700 border-orange-300",
    bg: "bg-orange-400/80",
  },
  normal: {
    label: "Neutral",
    color: "bg-gray-100 text-gray-700 border-gray-300",
    bg: "bg-gray-500/50",
  },
  low: {
    label: "Low Priority",
    color: "bg-zinc-100 text-zinc-500 border-zinc-300",
    bg: "bg-zinc-300/70",
  },
};

const Card = ({
  card,
  columnIndex,
  moveCard,
  moveCardOnServer,
  onEdit,
  onDelete,
  cardIndex,
  columns,
}) => {
  const ref = useRef(null);

  // 🟦 Kéo thả card
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: {
      id: card.id,
      fromColumnIndex: columnIndex,
      fromCardIndex: cardIndex,
      card,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      if (monitor.didDrop()) {
        console.log("[DND][end] ✅ Drag finished successfully for:", item.id);
      } else {
        console.log("[DND][end] ❌ Drag cancelled for:", item?.id);
      }
    },
  });

  // 🟥 Nhận thả (drop)
  const [, drop] = useDrop({
    accept: ItemTypes.CARD,
    hover(item, monitor) {
      if (!ref.current) return;
      if (monitor.didDrop()) return; // 🧩 Ngăn propagation nếu đã handled

      const { fromColumnIndex, fromCardIndex } = item;
      const toColumnIndex = columnIndex;
      const toCardIndex = cardIndex;

      // 🚫 Nếu khác column thì không xử lý (để Column.jsx xử lý cross-column)
      if (fromColumnIndex !== toColumnIndex) return;

      console.log("[DND][hover]", {
        cardId: item.id,
        fromColumnIndex,
        fromCardIndex,
        toColumnIndex,
        toCardIndex,
      });

      if (fromCardIndex === toCardIndex) return;

      moveCard(fromColumnIndex, fromCardIndex, toColumnIndex, toCardIndex);
      item.fromCardIndex = toCardIndex;
      item.fromColumnIndex = toColumnIndex;
    },

    drop(item, monitor) {
      if (monitor.didDrop()) return; // 🧩 Ngăn double-drop

      const { card, fromColumnIndex, fromCardIndex } = item;
      const toColumnIndex = columnIndex;
      const toCardIndex = cardIndex;

      const fromColumnId = columns?.[fromColumnIndex]?._id;
      const toColumnId = columns?.[toColumnIndex]?._id;

      console.log("[DND][drop] 🟢 Dropped card:", {
        cardId: card.id,
        fromColumnIndex,
        fromCardIndex,
        toColumnIndex,
        toCardIndex,
        fromColumnId,
        toColumnId,
      });

      // 🚫 Không gọi API khi khác cột — Column.jsx sẽ xử lý
      if (fromColumnIndex !== toColumnIndex) {
        console.log(
          "[DND][drop] ⏭ Skipping cross-column drop (handled by Column.jsx)"
        );
        return;
      }

      if (!fromColumnId || !toColumnId) {
        console.error("[DND][drop] ❌ Missing column IDs!", {
          fromColumnId,
          toColumnId,
        });
        return;
      }

      // Luôn gọi moveCardOnServer nếu có thao tác drop và vị trí thực sự thay đổi
      if (
        fromColumnIndex === toColumnIndex &&
        (fromCardIndex !== toCardIndex ||
          columns[toColumnIndex].cards[toCardIndex]?.id !== card.id)
      ) {
        console.log("[DND][drop] 🔄 Syncing reorder with server...");
        moveCardOnServer(card.id, fromColumnId, toColumnId, toCardIndex)
          .then((res) =>
            console.log("[DND][drop] ✅ Server update success:", res)
          )
          .catch((err) => {
            console.error(
              "[DND][drop] ❌ Server update failed:",
              err?.response?.data || err.message || err
            );
          });
      } else {
        console.log(
          "[DND][drop] ⚠️ No movement detected, skipping server call."
        );
      }
    },
  });

  drag(drop(ref));

  const opacity = isDragging ? 0.5 : 1;
  const maxTasksToShow = 3;

  return (
    <div
      ref={ref}
      style={{ opacity }}
      className={`group p-5 rounded-2xl shadow-xl mb-4 cursor-grab active:cursor-grabbing relative transition-all duration-200 ${
        statusBadge[card.status]?.bg || "bg-white"
      } hover:scale-[1.025] hover:shadow-2xl`}
    >
      <div className="mb-2">
        <h4 className="font-semibold text-gray-800 truncate">{card.member}</h4>
        {card.user && card.user.fullName && (
          <span className="text-xs text-gray-500 block truncate">
            By: {card.user.fullName}
          </span>
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
              statusBadge[card.status]?.color ||
              "bg-gray-100 text-gray-500 border-gray-300"
            }`}
          >
            {statusBadge[card.status]?.label || card.status}
          </span>
          <button
            onClick={() => {
              console.log("[CARD][Edit] Editing card:", card.id);
              onEdit(card, columnIndex);
            }}
            className="text-gray-500 hover:text-blue-600 p-1 rounded-full hover:bg-blue-100 transition-colors"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={() => {
              console.log("[CARD][Delete] Deleting card:", card.id);
              onDelete(card.id, columnIndex);
            }}
            className="text-gray-500 hover:text-red-600 p-1 rounded-full hover:bg-red-100 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
