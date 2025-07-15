import React, { useEffect, useState } from 'react';
import NavBar from '../../components/Navbar/Navbar';
import NoteCard from '../../components/cards/NoteCard';
import { MdAdd } from 'react-icons/md';
import AddEditNotes from './AddEditNotes';
import moment from 'moment';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import Toast from '../../components/ToastMessage/Toast';
import EmptyCard from '../../components/EmptyCard/EmptyCard';
import AddNoteImg from "../../assets/images/no-data.svg";
import Noresult from "../../assets/images/noresult.svg"

Modal.setAppElement('#root'); // ✅ for accessibility

const Home = () => {
  const [openAddEditModal, setOpenEditModal] = useState({
    isShown: false,
    type: 'add',
    data: null,
  });
  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message:"",
    type: "add",
  }); 
  const [userInfo, setUserInfo] = useState(null);
  const [allNotes, setAllNotes] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
 
  const navigate = useNavigate();

  const handleEdit = (noteDetails) => {
    setOpenEditModal({ isShown: true, data: noteDetails, type: 'edit' });
  };
  
  const ShowToastsmessage = (message, type) =>{
    setShowToastMsg({
      isShown:true,
      message,
      type,
    })
  }
  const handleCloseToast = ()=>{
    setShowToastMsg({
      isShown:false,
      message:"",
    });
  }

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get('/api/auth/get-user');
      if (response.data?.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    }
  };

 const getAllNotes = async () => {
  try {
    const response = await axiosInstance.get('/api/notes/get-all-notes');

    const sortedNotes = response.data.notes.sort((a, b) => {
      if (a.isPinned === b.isPinned) {
        // ✅ Sort oldest to newest
        return new Date(a.createdOn) - new Date(b.createdOn);
      }
      // ✅ Pinned first
      return b.isPinned - a.isPinned;
    });

    setAllNotes(sortedNotes);
  } catch (error) {
    console.log('An unexpected error occurred, please try again later');
  }
};



  const onSearchNote = async(query)=>{
    try {
      const response = await axiosInstance.get('/api/notes/search-notes', {
        params:{query},
      });
        if(response.data && response.data.notes)
        {
          setIsSearch(true);
          setAllNotes(response.data.notes);
        }

    } catch (error) {
      console.log(error);
    }
  }

  const handleClearSearch =()=>{
    setIsSearch(false);
    getAllNotes();
  }

  const updateIsPinned = async(notedata) => {
  const noteId = notedata._id;

  try {
    const response = await axiosInstance.put(`/api/notes/update-note-pinned/${noteId}`, {
      isPinned: !notedata.isPinned, // ✅ toggle value
    });

    if (response.data && response.data.note) {
      ShowToastsmessage("Note updated successfully", "add");
      getAllNotes();
    }
  } catch (error) {
    console.log(error);
  }
};


  const deleteNote = async (data) => {
    console.log(data);
  const noteId = data._id;
  try {
    const response = await axiosInstance.delete(`/api/notes/delete-note/${noteId}`);
    
    if (response.data && !response.data.error) {
      ShowToastsmessage("Note deleted Sucessfully","delete");
      await getAllNotes();
    }
  } catch (error) {
    if (error.response?.data?.message) {
      console.log("An unexpected error occured .please try again");
    }
  }
}


  useEffect(() => {
    getAllNotes();
    getUserInfo();
  }, []);

  return (
    <>
      <NavBar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch}/>

      <div className="container mx-auto">
       {allNotes.length >0 ? ( <div className="grid grid-cols-3 gap-4 mt-8">
         {allNotes.map((item) => (
            <NoteCard
              key={item._id}
              title={item.title}
              content={item.content}
              note={item} 
              date={moment(item.createdOn).format('Do MMM YYYY')}
              tags={item.tags}
              isPinned={item.isPinned}
              onEdit={() => handleEdit(item)}
              onDelete={() => deleteNote(item)}
              onPinNote={() => updateIsPinned(item)}            />
          ))} 
        </div>
       ) : (<EmptyCard
  imgSrc={isSearch ? Noresult : AddNoteImg}
  message={
    isSearch
      ? "No notes matched your search. Try a different keyword!"
      : "Start creating your first note! Click the 'Add' button to jot down your thoughts, ideas, and reminders. Let's get started!"
  }
/>
)}
      </div>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-[#2B85FF] hover:bg-blue-600 absolute right-10 bottom-10"
        onClick={() => {
          setOpenEditModal({ isShown: true, type: 'add', data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        key={openAddEditModal.data?._id || 'new'}
        isOpen={openAddEditModal.isShown}
        onRequestClose={() =>
          setOpenEditModal({ isShown: false, type: 'add', data: null })
        }
        style={{
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.2)',
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 pt-5 overflow-scroll"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() =>
            setOpenEditModal({ isShown: false, type: 'add', data: null })
          }
          getAllNotes={getAllNotes}
          showToastsmessage = {ShowToastsmessage}
        />
      </Modal>

      <Toast
        isShown = {showToastMsg.isShown}
        message = {showToastMsg.message}
        type = {showToastMsg.type}
        onClose = {handleCloseToast}
      />
    </>
  );
};

export default Home;
