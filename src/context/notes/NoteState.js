import React,{useState} from 'react'
import NoteContext from './noteContext';

const NoteState = (props) =>{
    const host = "http://localhost:5000";
    const ni = [];
    const [notes, setNotes] = useState(ni);

    const getNotes = async () =>{
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'auth-token': localStorage.getItem('token') 
            }
          });
          const json = await response.json();
        // console.log(json)
        setNotes(json);
    }
    const addNote = async (title, description, tag) =>{
        const response = await fetch(`${host}/api/notes/addnote`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'auth-token': localStorage.getItem('token') 
            },
           
            body: JSON.stringify({title,description,tag}) 
          });
          const note = await response.json();
        //   console.log(json);
        // const note = {
        //     "_id": json._id,
        //     "user": json.user,
        //     "title": title,
        //     "description": description,
        //     "tag": tag,
        //     "date": json.date,
        //     "__v": 0
        //   }
        setNotes(notes.concat(note))
    }
    const deleteNote = async (id) =>{
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
        // console.log("deleteinmg the note " + _id);
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
              'auth-token': localStorage.getItem('token') 
            },
        });
        // eslint-disable-next-line
        const json = await response.json();
        // console.log(json);
        const newNotes = notes.filter((note)=>{return note._id !== id});
        setNotes(newNotes);
    }
    const editNote = async (id, title, description, tag) =>{
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'auth-token': localStorage.getItem('token') 
            },
           
            body: JSON.stringify({title,description,tag}) 
          });
          // eslint-disable-next-line
          const json = response.json();
        let newNotes = JSON.parse(JSON.stringify(notes));
        for (let i = 0; i < newNotes.length; i++){
             if(newNotes[i]._id===id){
                newNotes[i].title = title;
                newNotes[i].description = description;
                newNotes[i].tag = tag;
                break;
            }
         }
         setNotes(newNotes);
    }
    return(
        <NoteContext.Provider value = {{notes, addNote, deleteNote, editNote,getNotes}}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;