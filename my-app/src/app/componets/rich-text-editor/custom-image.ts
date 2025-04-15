import { Node, mergeAttributes } from "@tiptap/core";

// Custom Image extension
export const CustomImage = Node.create({
  name: "customImage",
  group: "block",
  inline: false,
  selectable: true,
  draggable: true,
  addAttributes() {
    return {
      src: { default: null },
      class: { default: "mx-auto" },
    };
  },
  parseHTML() {
    return [{ tag: "img" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["img", mergeAttributes(HTMLAttributes)];
  },
  addCommands() {
    return {
      setCustomImage:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});
