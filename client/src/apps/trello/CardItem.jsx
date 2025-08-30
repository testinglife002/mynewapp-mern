import React from 'react';

function CardItem({
  key,
  card,
  onOpenCardDetails,
  onDragStart,
  onDragEnter,
  onDragLeave,
  onDrop,
  onDragOver,
  onDragEnd,
  index,
}) {
  const isOverdue = card.dueDate && new Date(card.dueDate) < new Date() && !card.completed;
  const dueDateText = card.dueDate ? new Date(card.dueDate).toLocaleDateString() : '';

  return (
    <div
      role="button"
      aria-label={`Card: ${card.title}`}
      className="bg-white p-3 rounded-md shadow hover:shadow-lg border border-gray-200 transition duration-150 cursor-grab"
      draggable
      onClick={() => onOpenCardDetails(card._id)}
      onDragStart={(e) => onDragStart(e, card._id, card.list, index)}
      onDragEnter={(e) => onDragEnter(e, card._id, card.list, index)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, card.list)}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <h4 className="text-base font-semibold text-gray-900 mb-1 truncate">{card.title}</h4>

      {card.description && (
        <p className="text-sm text-gray-600 line-clamp-2 mb-2">{card.description}</p>
      )}

      {Array.isArray(card.labels) && card.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {card.labels.map((label, idx) => (
            <span key={idx} className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
              {label}
            </span>
          ))}
        </div>
      )}

      {card.dueDate && (
        <div className={`text-xs ${isOverdue ? 'text-red-600' : 'text-gray-500'} mb-2`}>
          📅 {dueDateText} {isOverdue && '(Overdue)'}
        </div>
      )}

      {Array.isArray(card.members) && card.members.length > 0 && (
        <div className="flex flex-wrap items-center gap-1 mt-2">
          {card.members.map((member) => (
            <span
              key={member._id}
              className="text-xs px-2 py-1 bg-gray-200 rounded-full text-gray-700"
            >
              {member.username?.split(' ')[0] ?? 'User'}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-end text-xs text-gray-500 mt-2 gap-3">
        {Array.isArray(card.checklists) && card.checklists.length > 0 && (
          <span>
            ✅ {card.checklists.reduce((acc, cl) => acc + cl.items.filter(i => i.completed).length, 0)}/
            {card.checklists.reduce((acc, cl) => acc + cl.items.length, 0)}
          </span>
        )}
        {Array.isArray(card.comments) && card.comments.length > 0 && (
          <span>💬 {card.comments.length}</span>
        )}
        {Array.isArray(card.attachments) && card.attachments.length > 0 && (
          <span>📌 {card.attachments.length}</span>
        )}
      </div>
    </div>
  );
}

export default CardItem;
