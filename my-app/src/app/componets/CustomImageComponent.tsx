import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import { useState } from "react";

export default function CustomImageComponent({ node, updateAttributes, editor }: any) {
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setStartX(e.clientX);
    setStartWidth(parseInt(node.attrs.width, 10));
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    const delta = e.clientX - startX;
    const newWidth = Math.max(50, startWidth + delta);
    updateAttributes({ width: `${newWidth}px` });
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  if (isResizing) {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }

  return (
    <NodeViewWrapper as="div" className="relative inline-block">
      <img
        src={node.attrs.src}
        alt={node.attrs.alt}
        className={node.attrs.class}
        style={{ width: node.attrs.width }}
      />
      <div
        onMouseDown={handleMouseDown}
        className="w-3 h-3 bg-gray-500 absolute bottom-0 right-0 cursor-nwse-resize rounded-full"
      ></div>
    </NodeViewWrapper>
  );
}
