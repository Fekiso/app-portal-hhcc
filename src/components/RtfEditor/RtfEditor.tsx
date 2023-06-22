import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface MyRTFEditorProps {
  handleChange: (value: string, id: string) => void;
  id: string;
  defaultValue?: string;
  readOnly?: boolean;
}

const RtfEditor: React.FC<MyRTFEditorProps> = ({ handleChange, defaultValue, readOnly, id }) => {
  const [editorContent, setEditorContent] = useState<string>(defaultValue || "");

  useEffect(() => {
    setEditorContent(defaultValue || "");
  }, [defaultValue]);

  const handleEditorChange = (content: any, delta: any, source: any, editor: any) => {
    setEditorContent(content);
    handleChange(editor.getHTML(), id);
  };

  return (
    <ReactQuill value={editorContent} id={id} onChange={handleEditorChange} readOnly={readOnly} />
  );
};

export default RtfEditor;
