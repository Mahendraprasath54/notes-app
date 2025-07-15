import React from 'react'
import { MdCreate, MdOutlinePushPin, MdDelete } from 'react-icons/md';

const NoteCard = ({
  title,
  date,
  content,
  tags,
  isPinned,
  onEdit,
  onDelete,
  onPinNote,
  note
}) => {
  return (
    <div className='border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out'>
      <div className='flex items-center justify-between'>
        <div>
          <h6 className='text-sm font-medium flex items-center gap-1'>
            {title}
            {isPinned && (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-[2px] rounded-full">📌 Pinned</span>
            )}
          </h6>
          <span className='text-xs text-slate-500'>{date}</span>
        </div>
        <MdOutlinePushPin
          className={`icon-btn cursor-pointer text-xl ${
            isPinned ? 'text-yellow-600' : 'text-slate-300'
          }`}
          onClick={() => onPinNote(note)}
        />
      </div>
      <p className='text-sm text-slate-600 mt-2'>
        {content?.slice(0, 100)}...
      </p>
      <div className='flex items-center justify-between mt-2'>
        <div className='text-xs text-slate-500'>
          {tags.map((item, idx) => (
            <span key={idx}>#{item} </span>
          ))}
        </div>
        <div className='flex items-center gap-2'>
          <MdCreate className='icon-btn hover:text-green-600 cursor-pointer' onClick={onEdit} />
          <MdDelete className='icon-btn hover:text-red-500 cursor-pointer' onClick={onDelete} />
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
