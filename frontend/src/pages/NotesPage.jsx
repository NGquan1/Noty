import React, { useState, useEffect } from "react";
import { Plus, MoreVertical } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNoteStore } from "../store/useNoteStore";
import Toast from "../components/Toast";

const NotesPage = ({ selectedProjectId }) => {
  const { notes, fetchNotes, createNote, updateNote } = useNoteStore();
  const [selectedNote, setSelectedNote] = useState(null);
  const [editorValue, setEditorValue] = useState("");
  const [titleValue, setTitleValue] = useState("");
  const [error, setError] = useState(""); 
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (selectedProjectId) fetchNotes(selectedProjectId);
  }, [selectedProjectId, fetchNotes]);

  // Không tự động chọn note đầu tiên, để user tự chọn

  useEffect(() => {
    if (selectedNote) {
      setEditorValue(selectedNote.content);
      setTitleValue(selectedNote.title);
    }
  }, [selectedNote]);

  const handleSave = async () => {
    if (!selectedNote) return;
    await updateNote(selectedNote._id, {
      title: titleValue,
      content: editorValue,
      projectId: selectedProjectId,
    });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleAddNote = async () => {
    if (!selectedProjectId) {
      alert("Please select a project before adding a note.");
      return;
    }
    await createNote({
      title: "New Note",
      content: "",
      projectId: selectedProjectId,
    });
  };

  return (
    <div className="flex h-auto min-h-[500px]">
      <div className="w-72 bg-white/80 p-4 flex flex-col gap-2 border-r rounded-2xl shadow-xl mr-4">
        <div className="font-extrabold text-lg mb-3 text-primary tracking-wide">Notes</div>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        {notes.length === 0 ? (
          <div className="text-gray-400 italic text-center py-8 select-none">No notes yet. Click + to add!</div>
        ) : (
          notes.map((note) => (
            <div
              key={note._id}
              className={`group relative rounded-2xl px-4 py-3 mb-2 cursor-pointer transition-all duration-150 border-2 ${
                selectedNote?._id === note._id
                  ? "bg-primary/10 border-primary shadow-lg font-semibold scale-[1.03]"
                  : "bg-gray-200 border-transparent hover:bg-primary/5 hover:border-primary/40"
              }`}
              onClick={() => setSelectedNote(note)}
            >
              <div className="flex items-center justify-between">
                <div className="truncate text-base font-semibold">{note.title}</div>
                <button
                  className="p-1 rounded-full hover:bg-gray-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(openMenuId === note._id ? null : note._id);
                  }}
                >
                  <MoreVertical size={18} />
                </button>
              </div>
              <div className="text-xs text-gray-500 truncate">
                {note.content.replace(/<[^>]+>/g, "").slice(0, 40)}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {note.user?.fullName ? `By: ${note.user.fullName}` : ''}
              </div>
              {openMenuId === note._id && (
                <div className="absolute right-2 top-8 z-10 bg-white border rounded shadow p-2">
                  <button
                    className="text-red-600 hover:text-white hover:bg-red-600 px-2 py-1 rounded-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      useNoteStore
                        .getState()
                        .deleteNote(note._id, selectedProjectId);
                      setOpenMenuId(null);
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
        <button
          onClick={handleAddNote}
          className="mt-2 flex items-center justify-center bg-primary/10 hover:bg-primary/20 transition-all duration-200 ease-in-out transform hover:scale-110 rounded-full w-12 h-12 mx-auto text-2xl text-primary shadow"
        >
          <Plus size={28} />
        </button>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="bg-primary/10 rounded-b-2xl px-8 py-2 flex justify-center mb-4 mt-0 mx-4 shadow">
          <div
            id="custom-quill-toolbar"
            className="rounded-md shadow bg-white px-4 py-2"
            style={{ minWidth: 420, maxWidth: 600 }}
          >
            <select className="ql-header" defaultValue="">
              <option value="">Normal</option>
              <option value="1">Heading</option>
              <option value="2">Subheading</option>
            </select>
            <button className="ql-bold" />
            <button className="ql-italic" />
            <button className="ql-underline" />
            <button className="ql-blockquote" />
            <button className="ql-code-block" />
            <button className="ql-list" value="ordered" />
            <button className="ql-list" value="bullet" />
            <button className="ql-link" />
            <button className="ql-image" />
          </div>
        </div>
        <div className="flex-1 bg-white rounded-lg shadow-xl p-8 mx-4">
          <input
            className="text-2xl font-bold mb-2 w-full border-b outline-none"
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            placeholder="Note title"
          />
          {selectedNote ? (
            <>
              <ReactQuill
                value={editorValue}
                onChange={setEditorValue}
                className="mb-6"
                modules={{
                  toolbar: { container: "#custom-quill-toolbar" },
                }}
                formats={[
                  "header",
                  "bold",
                  "italic",
                  "underline",
                  "blockquote",
                  "code-block",
                  "list",
                  "bullet",
                  "link",
                  "image",
                ]}
              />
              <div className="mt-4 flex gap-2">
                <button
                  className="bg-gray-600 text-white px-4 py-2 rounded transition-all duration-200 ease-in-out transform hover:scale-110 hover:bg-gray-700"
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            </>
          ) : (
            <div className="text-gray-400">Select a note to view</div>
          )}
        </div>
        {showToast && (
          <Toast message="Note saved successfully!" type="success" />
        )}
      </div>
    </div>
  );
};

export default NotesPage;
