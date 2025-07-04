import React, { useRef, useEffect } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";

const TOOLBAR_ID = "quill-toolbar-main";

const modules = {
  toolbar: {
    container: `#${TOOLBAR_ID}`,
  },
};

export const QuillToolbar = () => (
  <div id={TOOLBAR_ID} className="quill-toolbar-custom">
    <style>{`
      #${TOOLBAR_ID} {
        border: none !important;
        background: transparent !important;
        box-shadow: none !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      #${TOOLBAR_ID} .ql-toolbar {
        border: none !important;
        background: transparent !important;
        box-shadow: none !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      #${TOOLBAR_ID} button, #${TOOLBAR_ID} select {
        color: #222 !important;
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
      }
    `}</style>
    <span className="ql-formats">
      <select className="ql-header" defaultValue="">
        <option value="">Normal</option>
        <option value="1">Heading</option>
        <option value="2">Subheading</option>
      </select>
    </span>
    <span className="ql-formats">
      <button className="ql-blockquote" />
      <button className="ql-code-block" />
    </span>
    <span className="ql-formats">
      <button className="ql-list" value="ordered" />
      <button className="ql-list" value="bullet" />
    </span>
    <span className="ql-formats">
      <button className="ql-link" />
      <button className="ql-image" />
    </span>
    <span className="ql-formats">
      <button className="ql-italic" />
    </span>
  </div>
);

const QuillDocEditor = ({ value, onChange, toolbarOnly, hideToolbar }) => {
  if (toolbarOnly) return <QuillToolbar />;
  if (hideToolbar) {
    return (
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        style={{ minHeight: 200 }}
        toolbar={false}
      />
    );
  }
  return (
    <>
      <QuillToolbar />
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        style={{ minHeight: 200 }}
      />
    </>
  );
};

export default QuillDocEditor;
