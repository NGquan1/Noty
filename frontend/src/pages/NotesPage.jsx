import React, { useState, useEffect } from "react";
import {
  Plus,
  MoreVertical,
  StickyNote,
  Sparkles,
  FileText,
} from "lucide-react";
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
    <div className="flex h-auto min-h-[500px] gap-4 relative">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none  opacity-40">
        <div className="absolute top-10 right-1/4 w-32 h-32 bg-violet-200/30 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-indigo-200/20 rounded-full blur-2xl"></div>
      </div>

      {/* Sidebar */}
      <div className="w-72 bg-white/90 backdrop-blur-sm p-6 flex flex-col gap-3 border border-gray-200 rounded-2xl shadow-xl relative z-10">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-violet-200/20 to-transparent rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-blue-200/20 to-transparent rounded-tr-full"></div>

        <div className="flex items-center gap-3 mb-2 relative z-10">
          <div className="p-3 bg-gradient-to-br from-violet-500/10 to-blue-500/10 rounded-2xl backdrop-blur-sm border border-violet-200/30">
            <StickyNote className="w-7 h-7 text-violet-600" />
          </div>
          <div>
            <div className="font-extrabold text-4xl text-gray-800">Notes</div>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Manage your notes
            </p>
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm mb-2 bg-red-50 p-2 rounded-lg border border-red-200 relative z-10">
            {error}
          </div>
        )}

        <div className="flex-1 space-y-2 relative z-10 max-h-[calc(100vh-300px)] pr-2 custom-scrollbar">
          {notes.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-violet-50/30 rounded-xl border-2 border-dashed border-gray-200">
              <div className="w-16 h-16 mx-auto mb-3 bg-violet-100 rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8 text-violet-400" />
              </div>
              <p className="text-gray-600 font-semibold">No notes yet</p>
              <p className="text-sm text-gray-400 mt-1">Click + to add one</p>
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note._id}
                className={`group relative rounded-xl px-4 py-3 cursor-pointer transition-all duration-200 border-2 ${
                  selectedNote?._id === note._id
                    ? "bg-gradient-to-r from-violet-900 to-violet-700 border-violet-900 text-white shadow-lg shadow-violet-500/30 scale-[1.02]"
                    : "bg-gray-50/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:border-violet-300 hover:shadow-md hover:scale-[1.02]"
                }`}
                onClick={() => setSelectedNote(note)}
              >
                {selectedNote?._id !== note._id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 to-violet-500/0 group-hover:from-violet-500/5 group-hover:to-violet-500/10 transition-all"></div>
                )}

                <div className="flex items-center justify-between relative z-10">
                  <div className="truncate text-base font-bold flex items-center gap-2">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        selectedNote?._id === note._id
                          ? "bg-white"
                          : "bg-violet-400"
                      }`}
                    ></span>
                    {note.title}
                  </div>
                  <button
                    className={`p-1 rounded-lg transition-colors ${
                      selectedNote?._id === note._id
                        ? "hover:bg-white/20"
                        : "hover:bg-gray-200"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === note._id ? null : note._id);
                    }}
                  >
                    <MoreVertical size={18} />
                  </button>
                </div>
                <div
                  className={`text-xs truncate mt-2 ${
                    selectedNote?._id === note._id
                      ? "text-white/80"
                      : "text-gray-600"
                  }`}
                >
                  {note.content.replace(/<[^>]+>/g, "").slice(0, 50)}
                </div>
                {note.user?.fullName && (
                  <div
                    className={`text-xs mt-2 flex items-center gap-1 ${
                      selectedNote?._id === note._id
                        ? "text-white/70"
                        : "text-gray-500"
                    }`}
                  >
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {note.user.fullName}
                  </div>
                )}
                {openMenuId === note._id && (
                  <div className="absolute right-2 top-12 z-20 bg-white border-2 border-gray-200 rounded-xl shadow-xl p-2">
                    <button
                      className="text-red-600 hover:text-white hover:bg-red-600 px-3 py-2 rounded-lg font-semibold transition-all w-full text-left"
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
        </div>

        <button
          onClick={handleAddNote}
          className="mt-3 flex items-center justify-center bg-gradient-to-br from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 transition-all duration-200 ease-in-out transform hover:scale-110 hover:shadow-lg hover:shadow-violet-500/50 rounded-full w-12 h-12 mx-auto text-white shadow-lg relative z-10 group"
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></div>
          <Plus size={28} className="relative z-10" />
        </button>
      </div>

      {/* Editor Section */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Toolbar */}
        <div className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl px-8 py-3 flex justify-center mb-4 shadow-xl relative">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-blue-600/10 opacity-50"></div>
          <div
            id="custom-quill-toolbar"
            className="rounded-xl shadow-lg bg-white/95 backdrop-blur-sm px-5 py-2.5 relative z-10 border border-gray-200"
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

        {/* Editor Content */}
        <div className="flex-1 bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-2xl shadow-xl p-8 relative ">
          {/* Decorative corner */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-200/20 to-transparent rounded-bl-full"></div>

          <div className="relative z-10">
            <input
              className="text-3xl font-black mb-4 w-full border-b-2 border-gray-200 outline-none focus:border-violet-500 transition-colors pb-2 bg-transparent"
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
                <div className="mt-6 flex gap-3">
                  <button
                    className="bg-gradient-to-r from-gray-700 to-gray-800 text-white px-6 py-2.5 rounded-xl font-bold transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg hover:shadow-gray-500/50 relative group"
                    onClick={handleSave}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="relative z-10">Save Changes</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-br from-gray-50 to-violet-50/30 rounded-xl border-2 border-dashed border-gray-200">
                <div className="w-20 h-20 bg-violet-100 rounded-2xl flex items-center justify-center mb-4">
                  <FileText className="w-10 h-10 text-violet-400" />
                </div>
                <p className="text-gray-600 font-bold text-lg">
                  Select a note to view
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Choose from the sidebar or create a new one
                </p>
              </div>
            )}
          </div>
        </div>
        {showToast && (
          <Toast message="Note saved successfully!" type="success" />
        )}
      </div>
    </div>
  );
};

export default NotesPage;
