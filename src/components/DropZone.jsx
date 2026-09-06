import React from 'react';
import { useDroppable } from '@dnd-kit/core';

export function DropZone({ children }) {
  const { isOver, setNodeRef } = useDroppable({
    id: 'area-de-montagem',
  });

  const style = {
    borderColor: isOver ? 'var(--cta-btn)' : '#DADADC',
    backgroundColor: isOver ? '#FFF7EF' : '#fff',
    minHeight: '170px',
    border: '3px dashed',
    borderRadius: '20px',
    padding: '16px',
    display: 'flex',
    flexWrap: 'wrap',
    alignContent: 'flex-start',
    gap: '14px',
    transition: 'all 0.2s ease'
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
}