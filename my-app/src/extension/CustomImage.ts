import { Node, mergeAttributes } from "@tiptap/core";

export interface ImageOptions {
  HTMLAttributes: Record<string, any>;
}

const CustomImage = Node.create<ImageOptions>({
  name: "image",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      class: {
        default: "mx-auto",
      },
      width: {
        default: "300px",
      },
    };
  },

  parseHTML() {
    return [{ tag: "img[src]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["img", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },

  addCommands() {
    return {
      setImage:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
      setImageSize:
        ({ width }) =>
        ({ chain, state }) => {
          const { selection } = state;
          const node = state.doc.nodeAt(selection.from);
          if (node?.type.name !== "image") return false;
          return chain().updateAttributes(this.name, { width }).run();
        },
    };
  },
});

export default CustomImage;
