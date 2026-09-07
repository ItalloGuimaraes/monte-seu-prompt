import React from 'react';
import { useDroppable } from '@dnd-kit/core';

export function DropZone({ children }) {
  const { isOver, setNodeRef } = useDroppable({
    id: 'area-de-montagem',
  });

  const style = {
    borderColor: isOver ? 'var(--cta-btn)' : '#DADADC',
    backgroundColor: isOver ? '#FFF7EF' : '#fff',
    minHeight: '135px',
    border: '3px dashed',
    borderRadius: '16px',
    padding: '12px',
    display: 'flex',
    flexWrap: 'wrap',
    alignContent: 'flex-start',
    gap: '10px',
    transition: 'all 0.2s ease'
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
}