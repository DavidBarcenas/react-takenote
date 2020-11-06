import { types } from '../types/types';
import { showAlert } from './uiActions';
import {
  alert_message_success,
  alert_type_success,
} from '../../const/constants';
import {
  deleteDoc,
  getNotes,
  saveNote,
  updateDoc,
} from '../../providers/firebaseService';
import { db } from '../../providers/firebase';

export const userNotes = () => {
  return async (dispatch, getState) => {
    const { uid, name } = getState().auth;
    try {
      const userdata = await db.doc(`${uid}/notes`).get();
      if (userdata.data()) {
        const folders = userdata.data().folders;
        dispatch(getAllFolders(folders));
        dispatch(getNotesFolder(folders[0]));
      } else {
        await db.collection(uid).doc('user').set({ name });
      }
    } catch (error) {
      console.log(error);
      dispatch(showAlert('Ocurrió un error, intente más tarde', 'error'));
    }
  };
};

export const saveNewNote = (note) => {
  return async (dispatch, getState) => {
    const { auth, notes } = getState();
    const folderExists = notes.folders.find((f) => f === note.collection);
    dispatch(showAlert(alert_message_success, alert_type_success));
    try {
      const newNote = await saveNote(auth.uid, note);
      if (notes.folders.length > 0) {
        if (!folderExists) {
          await db
            .doc(`${auth.uid}/notes`)
            .update({ folders: [note.collection, ...notes.folders] });
          dispatch(getAllFolders([note.collection, ...notes.folders]));
        }
      } else {
        await db
          .collection(auth.uid)
          .doc('notes')
          .set({
            folders: [note.collection],
          });
        dispatch(getAllFolders([note.collection]));
      }

      if (note.collection !== notes.activeFolder) {
        dispatch(getNotesFolder(note.collection));
      } else {
        dispatch(folderNotes([newNote, ...notes.folderNotes]));
        dispatch(activateNote(newNote));
      }
    } catch (error) {
      dispatch(showAlert('No se guardo la nota correctamente', 'error'));
    }
  };
};

export const getNotesFolder = (folder) => {
  return async (dispatch, getState) => {
    const { uid } = getState().auth;
    try {
      const notes = await getNotes(uid, folder);
      dispatch(activateFolder(folder));
      dispatch(folderNotes(notes.docs.map((doc) => doc.data())));
      dispatch(activateNote(notes.docs[0].data()));
    } catch (error) {
      dispatch(showAlert('No se pudo obtener las notas', 'error'));
    }
  };
};

export const updateNote = (note) => {
  return async (dispatch, getState) => {
    const { notes, auth } = getState();
    const noteList = notes.folderNotes.filter((n) => n.id !== note.id);

    try {
      await db.doc(`${auth.uid}/notes/list/${note.id}`).update(note);

      if (note.collection !== notes.activeFolder) {
        if (notes.folderNotes.length === 1) {
          const updateFolders = notes.folders.filter(
            (folder) => folder !== notes.activeFolder
          );
          await db.doc(`${auth.uid}/notes`).update({ folders: updateFolders });
          dispatch(getAllFolders(updateFolders));
        }
        if (!notes.folders.includes(note.collection)) {
          await db
            .doc(`${auth.uid}/notes`)
            .update({ folders: [note.collection, ...notes.folders] });
          dispatch(getAllFolders([note.collection, ...notes.folders]));
        }
        dispatch(getNotesFolder(note.collection));
      } else {
        dispatch(folderNotes([note, ...noteList]));
        dispatch(activateNote(note));
      }
      dispatch(cancelNoteEdit());
      dispatch(showAlert('¡Se actualizó la nota!', 'success'));
    } catch (error) {
      dispatch(showAlert('No se pudo actualizar la nota', 'error'));
    }
  };
};

export const deleteNote = () => {
  return async (dispatch, getState) => {
    const { activeNote, folderNotes, folders } = getState().notes;
    const updateList = folders.list.filter((f) => f !== activeNote.collection);
    console.log('ipdateList', updateList);
    try {
      await deleteDoc(activeNote.collection, activeNote.id);
      dispatch(showAlert('Nota eliminada', 'success'));
      dispatch(removeNote(activeNote.id));

      if (folderNotes.length === 1) {
        dispatch(getAllFolders(updateList, folders.id));
        if (updateList.length > 0) {
          dispatch(getNotesFolder(updateList[0]));
        }
        await updateDoc('folders', folders.id, {
          list: updateList,
        });
      }
    } catch (error) {
      console.log(error);
      dispatch(showAlert('No se pudo eliminar la nota', 'error'));
    }
  };
};

export const cancelNoteEdit = () => ({
  type: types.cancelNote,
  payload: false,
});

export const activateNote = (note) => ({
  type: types.activateNote,
  payload: note,
});

export const activateFolder = (folder) => ({
  type: types.activateFolder,
  payload: folder,
});

export const newNote = (note) => ({
  type: types.createNote,
  payload: {
    edit: true,
    note,
  },
});

const getAllFolders = (folders) => ({
  type: types.folders,
  payload: {
    list: folders,
    active: folders.length > 0 ? folders[0] : null,
  },
});

const folderNotes = (notes) => ({
  type: types.notes,
  payload: notes,
});

const removeNote = (noteId) => ({
  type: types.deleteNote,
  payload: noteId,
});
