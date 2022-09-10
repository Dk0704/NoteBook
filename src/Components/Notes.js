import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import noteContext from '../context/notes/noteContext';
import AddNote from './AddNote';
import NoteItem from './NoteItem';


const Notes = ()=> {
    let history = useNavigate();
    const context = useContext(noteContext);
    const { notes, getNotes , editNote} = context;
    
    const [note, setNote] = useState({title: "", description: "", tag: ""})
    const handleClick=()=>{
        editNote(note._id,note.title, note.description,note.tag);
        // console.log("updateing the note " , note);
        refClose.current.click();
    }
    
    const onChange=(e)=>{
        setNote({...note, [e.target.name]: e.target.value})
    }
    useEffect(() => {
            // getNotes();
        if(localStorage.getItem('token')){
            getNotes();
        }
        else{
            history("/login");
        }
        // eslint-disable-next-line
    }, []);
    const updateNote = (curNote) => {
        ref.current.click();
        setNote(curNote);

    }
    const ref = useRef(null);
    const refClose = useRef(null);
    return (
        <>
            <AddNote />

            <button type="button" ref={ref} className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal
            </button>


            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Title</label>
                                    <input type="text" className="form-control" value={note.title} id="title" name="title" onChange={onChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <input type="text" className="form-control" value={note.description} id="description" name="description" onChange={onChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="tag" className="form-label">Tag</label>
                                    <input type="text" className="form-control" value={note.tag} id="tag" name="tag" onChange={onChange} />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" ref={refClose}>Close</button>
                            <button disabled={note.title.length<3 || note.description.length<5 } type="button" onClick={handleClick} className="btn btn-primary">Update Note</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row my-3">
                <h1>Your Notes </h1>
                {notes.map((note) => {
                    <h1>{note.description}</h1>
                    return <NoteItem key={note._id} updateNote={updateNote} note={note} />
                })}
            </div>
        </>
    )
}

export default Notes
