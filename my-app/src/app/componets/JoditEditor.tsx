import React, { useState, useRef, useMemo, useEffect } from 'react';
import JoditEditor from 'jodit-react';

const JoditEditorTemplate = ({ placeholder, value, onChange }) => {
  const editor = useRef(null);
  const [content, setContent] = useState(value || '');

  // Sync content state when value prop changes
  useEffect(() => {
    setContent(value || '');
  }, [value]);

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || 'Start typing...',
    }),
    [placeholder]
  );

  return (
    <JoditEditor
      ref={editor}
      value={content}
      config={config}
      tabIndex={1}
      onBlur={(newContent) => {
        setContent(newContent);
        if (onChange) onChange(newContent);
      }}
      onChange={(newContent) => {
        setContent(newContent);
        if (onChange) onChange(newContent);
      }}
      className="h-[900px]"
    />
  );
};

export default JoditEditorTemplate;
