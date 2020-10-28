import React from 'react';
import { ArrowBack, Delete, Edit, Label } from '@material-ui/icons';
import { IconButton, Tooltip } from '@material-ui/core';
import { NoteEdit } from './NoteEdit';
import { useSelector } from 'react-redux';
import empty from '../../assets/images/empty.svg';

export const Note = () => {
  const { activeNote, folders } = useSelector((state) => state.notes);

  if (!activeNote) {
    return (
      <div className="note note__empty">
        <img src={empty} alt="No hay documentos" />
        <span>
          {folders.list.length === 0 ? 'No hay notas' : 'Cargando notas'}
        </span>
      </div>
    );
  }

  return (
    <div className="note">
      {activeNote.id === '' ? (
        <NoteEdit note={activeNote} folders={folders.list} />
      ) : (
        <>
          <div className="note__actionbar">
            <ArrowBack />
            <div>
              <Tooltip title="Editar">
                <IconButton aria-label="editar">
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Eliminar">
                <IconButton aria-label="eliminar">
                  <Delete />
                </IconButton>
              </Tooltip>
              <Tooltip title="Mover a">
                <IconButton aria-label="mover a">
                  <Label />
                </IconButton>
              </Tooltip>
            </div>
          </div>

          <div className="note__wrap">
            <h2 className="note__title">{activeNote.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: activeNote.body }}></div>
          </div>
        </>
      )}
    </div>
  );
};
