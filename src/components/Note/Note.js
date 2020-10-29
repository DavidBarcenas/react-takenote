import React, { useState } from 'react';
import { ArrowBack, Delete, Edit, Label } from '@material-ui/icons';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
} from '@material-ui/core';
import { NoteEdit } from './NoteEdit';
import { useDispatch, useSelector } from 'react-redux';
import empty from '../../assets/images/empty.svg';
import { deleteNote } from '../../redux/actions/noteActions';

export const Note = () => {
  const dispatch = useDispatch();
  const [openDelete, setOpenDelete] = useState(false);
  const { activeNote, folders, folderNotes } = useSelector(
    (state) => state.notes
  );

  if (folders.list.length === 0 || folderNotes.length === 0 || !activeNote) {
    return (
      <div className="note note__empty">
        <img src={empty} alt="No hay documentos" />
        <span>
          {folders.list.length === 0 ? 'No hay notas' : 'Cargando notas'}
        </span>
      </div>
    );
  }

  const handleDelete = () => {
    dispatch(deleteNote());
    setOpenDelete(false);
  };

  return (
    <div className="note">
      {activeNote && activeNote.id === '' ? (
        <NoteEdit note={activeNote} folders={folders.list} />
      ) : (
        <>
          <div className="note__actionbar">
            <div className="note__icon-back">
              <ArrowBack />
            </div>
            <div>
              <Tooltip title="Editar">
                <IconButton aria-label="editar">
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Eliminar">
                <IconButton
                  aria-label="eliminar"
                  onClick={() => setOpenDelete(true)}
                >
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
            <div
              className="note__body"
              dangerouslySetInnerHTML={{ __html: activeNote.body }}
            ></div>
          </div>
        </>
      )}

      <Dialog
        open={openDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Eliminar nota</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Estás seguro que quieres eliminar "{activeNote.title}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
