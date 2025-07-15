const Note = require("../models/notes_model");

const addNote = async (req, res) => {
    const { title, content, tags } = req.body;
    const userId = req.user?.user?._id;

    if (!title) {
        return res.status(400).json({ message: "Title is required" });
    }

    if (!content) {
        return res.status(400).json({ message: "Content is required" });
    }

    try {
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId: userId
        });

        await note.save();
        return res.json({
            error: false,
            note,
            message: "Note created successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: true,
            message: "Internal server error"
        });
    }
};

const editNote = async(req,res) =>{
    const noteId = req.params.noteId;
    const {title, content, tags, isPinned } = req.body;
    const userId = req.user?.user?._id;

    if(!title && !content  && !tags)
    {
        return res
        .status(400)
        .json({
            error:"true",
            message:"No changes provided"
        });
    }

    try{
        const note = await Note.findOne({_id:noteId, userId: userId});

        if(!note)
        {
            return res.status(404).json({error: true, message:"Note not found"})
        }

        if(title) note.title = title;
        if(content) note.content = content;
        if(tags) note.tags = tags;
        if(typeof isPinned !== 'undefined') note.isPinned = isPinned;
        await note.save();
        return res.json({
            error: false,
            note,
            message: "Note updated Sucessful"
        })
    }
    catch(error)
    {
       return res.status(500).json({
        error: true,
        message:"Internal server error"
       }) 
    }
}

const getAllNotes = async(req, res)=>{
    const user = req.user.user;
        console.log("Fetching all notes for user:", user._id);
    try{
        const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });
            return res.json({
            error: false,
            notes,
            message:  "eterived Sucessfully"
        });
    }
    catch(error){
        console.log(error);
        return res.json({
            error: true,
            message: "Internal server error"
        })
    }

}

const deleteNote = async (req, res) => {
  const noteId = req.params.noteId;
  const user = req.user.user;

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });

    if (!note) {
      return res.status(404).json({ error: true, message: 'Note not found' });
    }

    await Note.deleteOne({ _id: noteId, userId: user._id }); // ✅ Correct usage

    return res.json({
      error: false,
      message: 'Note deleted successfully', 
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: true,
      message: 'Internal server error',
    });
  }
};


const updateisPinned = async(req, res)=>{
    const noteId = req.params.noteId;
    const {isPinned } = req.body;
    const userId = req.user?.user?._id;

    try{
        const note = await Note.findOne({_id:noteId, userId: userId});

        if(!note)
        {
            return res.status(404).json({error: true, message:"Note not found"})
        }

       
        note.isPinned = isPinned;

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note updated Sucessful"
        })
    }
    catch(error)
    {
       return res.status(500).json({
        error: true,
        message:"Internal server error"
       }) 
    }
}

const searchNotes = async (req, res) => {
    const userId = req.user?.user?._id;
    const { query } = req.query;

    if (!userId) {
        return res.status(403).json({
            error: true,
            message: "Unauthorized access – user not found",
        });
    }

    if (!query) {
        return res.status(400).json({
            error: true,
            message: "Search query is required",
        });
    }

    try {
        const matchingNotes = await Note.find({
            userId: userId,
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } },
            ],
        });

        return res.json({
            error: false,
            notes: matchingNotes,
            message: "Notes matching the search query retrieved successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal server error",
        });
    }
};





module.exports = { addNote, editNote, getAllNotes, deleteNote, updateisPinned, searchNotes};
