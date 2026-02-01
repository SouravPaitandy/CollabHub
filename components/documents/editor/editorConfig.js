import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Strike from "@tiptap/extension-strike";
import Highlight from "@tiptap/extension-highlight";
import { ImageExtension } from "./extensions/ImageExtension";
import Link from "@tiptap/extension-link";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { getRandomColor, getRandomDarkColor } from "./colorUtils";

export const createEditorConfig = ({
  ydocRef,
  wsProviderRef,
  userData,
  initialContent,
  theme,
}) => {
  // Define base extensions with all required features
  const extensions = [
    StarterKit,
    Underline,
    // Strike, // Removed to prevent duplicate extension error
    Highlight,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: "text-blue-600 underline hover:text-blue-800",
      },
    }),
    ImageExtension.configure({
      HTMLAttributes: {
        class: "rounded-md max-w-full",
      },
    }),
    TextAlign.configure({
      types: ["heading", "paragraph"],
      alignments: ["left", "center", "right"],
    }),
    Table.configure({
      resizable: true,
    }),
    TableRow,
    TableHeader,
    TableCell,
    TextStyle,
    Color,
    Subscript,
    Superscript,
    TaskList,
    TaskItem.configure({
      nested: true,
    }),
  ];

  const isDarkMode =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  if (ydocRef.current && wsProviderRef.current) {
    extensions.push(
      Collaboration.configure({
        document: ydocRef.current,
      }),
      CollaborationCursor.configure({
        provider: wsProviderRef.current,
        user: userData || {
          name: "Anonymous",
          color: isDarkMode ? getRandomDarkColor() : getRandomColor(),
          avatar: null,
        },
        render: (user) => createCursorElement(user),
      }),
    );
  }

  return {
    extensions,
    content: initialContent || "<p>Start typing here...</p>",
    autofocus: false,
    editable: true,
    immediatelyRender: false, // Fix for SSR hydration mismatch
  };
};

// Helper function to create cursor element
function createCursorElement(user) {
  const cursor = document.createElement("div");
  cursor.classList.add("collaboration-cursor");
  cursor.setAttribute(
    "style",
    `border-left: 2px solid ${user.color}; border-right: 2px solid ${user.color}; margin-left: -2px; margin-right: -2px; pointer-events: none; position: relative; word-break: normal;`,
  );

  // Create the cursor label with user info
  const label = document.createElement("div");
  label.classList.add("collaboration-cursor-label");
  label.setAttribute(
    "style",
    `background-color: ${user.color}; color: black; font-size: 12px; font-weight: 600; padding: 2px 6px; border-radius: 4px 4px 4px 0; position: absolute; top: -1.4em; left: -2px; white-space: nowrap; pointer-events: none; user-select: none;`,
  );

  // Extract first name from full name
  const firstName = user.name.split(" ")[0];
  label.textContent = firstName;

  // Add avatar if available
  // if (user.avatar) {
  //   const avatar = document.createElement("img");
  //   avatar.setAttribute("src", user.avatar);
  //   avatar.setAttribute(
  //     "style",
  //     "width: 16px; height: 16px; border-radius: 50%; margin-right: 4px; vertical-align: middle;"
  //   );
  //   label.prepend(avatar);
  // }

  cursor.append(label);
  return cursor;
}
