import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import './Card.css';

// Adicionamos o instanceId aqui nas propriedades (props)
export function Card({ id, titulo, icone, categoria, isMini = false, onRemove, instanceId }) {
  
  // O truque de mestre: se a carta for um clone na mesa, ela recebe um ID composto (ex: tarefa-123456). 
  // Se for a carta do baralho, ela continua com o ID normal.
  const idUnico = instanceId ? `${id}-${instanceId}` : id;

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: idUnico, // Usamos o ID corrigido aqui
    data: { titulo, icone, categoria },
    disabled: isMini 
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...(!isMini ? listeners : {})} 
      {...(!isMini ? attributes : {})}
      className={`carta-tcg cat-${categoria} ${isMini ? 'mini' : ''}`}
    >
      
      {isMini && (
        <button 
          className="btn-remover"
          onClick={(e) => {
            e.stopPropagation(); 
            if (onRemove) onRemove();
          }}
          title="Remover carta"
        >
          ×
        </button>
      )}

      <div className="inner">
        <div className="carta-cabecalho">
          {titulo}
        </div>
        <div className="carta-arte">
          {icone}
        </div>
      </div>
    </div>
  );
}