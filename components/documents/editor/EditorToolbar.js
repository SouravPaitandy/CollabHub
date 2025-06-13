import React, { useState, useEffect, useMemo } from "react";
import {
  FaBold, FaItalic, FaUnderline, FaStrikethrough,
  FaListUl, FaListOl, FaIndent, FaOutdent,
  FaRedo, FaUndo, FaHeading, FaQuoteRight,
  FaLink, FaUnlink, FaImage, FaTable,
  FaAlignLeft, FaAlignCenter, FaAlignRight,
  FaCode, FaHighlighter, FaPalette,
  FaChevronDown, FaFont, FaEllipsisH, FaColumns
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// Toolbar button component
const ToolbarButton = React.memo(
  ({ isActive = false, onClick, title, icon, disabled = false }) => {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
          isActive
            ? "bg-gray-200 dark:bg-gray-600 text-indigo-600 dark:text-indigo-400"
            : "text-gray-700 dark:text-gray-300"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        title={title}
      >
        {icon}
      </button>
    );
  }
);

ToolbarButton.displayName = "ToolbarButton";

// Dropdown button component
const ToolbarDropdown = React.memo(({ 
  title, 
  icon, 
  isOpen, 
  toggleOpen, 
  children,
  showChevron = true
}) => {
  return (
    <div className="dropdown-container relative">
      <button
        onClick={toggleOpen}
        className={`p-2 rounded flex items-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
          isOpen
            ? "bg-gray-200 dark:bg-gray-600 text-indigo-600 dark:text-indigo-400"
            : "text-gray-700 dark:text-gray-300"
        }`}
        title={title}
      >
        {icon}
        {showChevron && (
          <FaChevronDown 
            className={`ml-1 text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 mt-1 z-20 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

ToolbarDropdown.displayName = "ToolbarDropdown";

// Toolbar divider component
const ToolbarDivider = () => (
  <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1" />
);

export default function EditorToolbar({ editor, theme }) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showTableMenu, setShowTableMenu] = useState(false);
  const [showLinkMenu, setShowLinkMenu] = useState(false);
  const [showHeadingMenu, setShowHeadingMenu] = useState(false);
  const [showMoreFormatting, setShowMoreFormatting] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageUrlInput, setShowImageUrlInput] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile screen on mount and when window resizes
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Color picker presets
  const colorPresets = [
    { name: "Default", value: "#000000", darkValue: "#FFFFFF" },
    { name: "Red", value: "#FF0000" },
    { name: "Orange", value: "#FFA500" },
    { name: "Yellow", value: "#FFFF00" },
    { name: "Green", value: "#008000" },
    { name: "Blue", value: "#0000FF" },
    { name: "Purple", value: "#800080" },
    { name: "Pink", value: "#FFC0CB" },
    { name: "Gray", value: "#808080" },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showColorPicker || 
        showLinkMenu || 
        showTableMenu || 
        showHeadingMenu || 
        showMoreFormatting || 
        showImageUrlInput
      ) {
        // Check if click is outside the dropdown
        if (!e.target.closest('.dropdown-container')) {
          setShowColorPicker(false);
          setShowLinkMenu(false);
          setShowTableMenu(false);
          setShowHeadingMenu(false);
          setShowMoreFormatting(false);
          setShowImageUrlInput(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [
    showColorPicker, 
    showLinkMenu, 
    showTableMenu, 
    showHeadingMenu, 
    showMoreFormatting,
    showImageUrlInput
  ]);

  // Format options
  const formatOptions = useMemo(() => {
    if (!editor) return null;

    return (
      <>
        <ToolbarButton
          isActive={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold (Ctrl+B)"
          icon={<FaBold />}
        />
        <ToolbarButton
          isActive={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic (Ctrl+I)"
          icon={<FaItalic />}
        />
        <ToolbarButton
          isActive={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Underline (Ctrl+U)"
          icon={<FaUnderline />}
        />
        
        {/* More formatting dropdown */}
        <ToolbarDropdown
          title="More Formatting"
          icon={<FaEllipsisH />}
          isOpen={showMoreFormatting}
          toggleOpen={() => setShowMoreFormatting(!showMoreFormatting)}
          showChevron={false}
        >
          <div className="p-1 min-w-[180px]">
            <button
              onClick={() => {
                editor.chain().focus().toggleStrike().run();
                setShowMoreFormatting(false);
              }}
              className={`w-full flex items-center px-3 py-2 text-sm rounded ${
                editor.isActive("strike")
                  ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <FaStrikethrough className="mr-2" /> Strikethrough
            </button>
            <button
              onClick={() => {
                editor.chain().focus().toggleHighlight().run();
                setShowMoreFormatting(false);
              }}
              className={`w-full flex items-center px-3 py-2 text-sm rounded ${
                editor.isActive("highlight")
                  ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <FaHighlighter className="mr-2" /> Highlight
            </button>
            <button
              onClick={() => {
                editor.chain().focus().toggleBlockquote().run();
                setShowMoreFormatting(false);
              }}
              className={`w-full flex items-center px-3 py-2 text-sm rounded ${
                editor.isActive("blockquote")
                  ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <FaQuoteRight className="mr-2" /> Blockquote
            </button>
            <button
              onClick={() => {
                editor.chain().focus().toggleCodeBlock().run();
                setShowMoreFormatting(false);
              }}
              className={`w-full flex items-center px-3 py-2 text-sm rounded ${
                editor.isActive("codeBlock")
                  ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <FaCode className="mr-2" /> Code Block
            </button>
          </div>
        </ToolbarDropdown>
      </>
    );
  }, [editor, showMoreFormatting]);

  // Paragraph and heading options
  const headingOptions = useMemo(() => {
    if (!editor) return null;

    return (
      <ToolbarDropdown
        title="Heading Styles"
        icon={<FaHeading />}
        isOpen={showHeadingMenu}
        toggleOpen={() => setShowHeadingMenu(!showHeadingMenu)}
      >
        <div className="p-1 min-w-[180px]">
          <button
            onClick={() => {
              editor.chain().focus().setParagraph().run();
              setShowHeadingMenu(false);
            }}
            className={`w-full text-left px-3 py-2 text-sm rounded ${
              editor.isActive("paragraph")
                ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            Normal Text
          </button>
          <button
            onClick={() => {
              editor.chain().focus().toggleHeading({ level: 1 }).run();
              setShowHeadingMenu(false);
            }}
            className={`w-full text-left px-3 py-2 text-sm rounded ${
              editor.isActive("heading", { level: 1 })
                ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <span className="text-xl font-bold">Heading 1</span>
          </button>
          <button
            onClick={() => {
              editor.chain().focus().toggleHeading({ level: 2 }).run();
              setShowHeadingMenu(false);
            }}
            className={`w-full text-left px-3 py-2 text-sm rounded ${
              editor.isActive("heading", { level: 2 })
                ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <span className="text-lg font-bold">Heading 2</span>
          </button>
          <button
            onClick={() => {
              editor.chain().focus().toggleHeading({ level: 3 }).run();
              setShowHeadingMenu(false);
            }}
            className={`w-full text-left px-3 py-2 text-sm rounded ${
              editor.isActive("heading", { level: 3 })
                ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <span className="text-base font-bold">Heading 3</span>
          </button>
        </div>
      </ToolbarDropdown>
    );
  }, [editor, showHeadingMenu]);

  // List options
  const listOptions = useMemo(() => {
    if (!editor) return null;

    return (
      <>
        <ToolbarButton
          isActive={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet List"
          icon={<FaListUl />}
        />
        <ToolbarButton
          isActive={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Ordered List"
          icon={<FaListOl />}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().sinkListItem("listItem").run()}
          title="Indent"
          disabled={!editor.can().sinkListItem("listItem")}
          icon={<FaIndent />}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().liftListItem("listItem").run()}
          title="Outdent"
          disabled={!editor.can().liftListItem("listItem")}
          icon={<FaOutdent />}
        />
      </>
    );
  }, [editor]);

  // Alignment options
  const alignmentOptions = useMemo(() => {
    if (!editor) return null;

    return (
      <>
        <ToolbarButton
          isActive={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          title="Align Left"
          icon={<FaAlignLeft />}
        />
        <ToolbarButton
          isActive={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          title="Align Center"
          icon={<FaAlignCenter />}
        />
        <ToolbarButton
          isActive={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          title="Align Right"
          icon={<FaAlignRight />}
        />
      </>
    );
  }, [editor]);

  // Media options
  const mediaOptions = useMemo(() => {
    if (!editor) return null;

    return (
      <>
        {/* Link dropdown */}
        <ToolbarDropdown
          title="Add or Edit Link"
          icon={<FaLink />}
          isOpen={showLinkMenu}
          toggleOpen={() => {
            if (!showLinkMenu && editor.isActive("link")) {
              const attributes = editor.getAttributes("link");
              setLinkUrl(attributes.href || "");
            } else if (!showLinkMenu) {
              setLinkUrl("");
            }
            setShowLinkMenu(!showLinkMenu);
          }}
          showChevron={false}
        >
          <div className="p-3 w-64">
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">URL</label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="https://example.com"
                autoFocus
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowLinkMenu(false)}
                className="px-3 py-1.5 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (linkUrl) {
                    editor.chain().focus().setLink({ href: linkUrl }).run();
                  } else {
                    editor.chain().focus().unsetLink().run();
                  }
                  setShowLinkMenu(false);
                }}
                className="px-3 py-1.5 text-sm bg-indigo-500 hover:bg-indigo-600 text-white rounded"
              >
                {editor.isActive("link") ? "Update" : "Add"} Link
              </button>
            </div>
          </div>
        </ToolbarDropdown>

        {editor.isActive("link") && (
          <ToolbarButton
            onClick={() => editor.chain().focus().unsetLink().run()}
            title="Remove Link"
            icon={<FaUnlink />}
          />
        )}

        {/* Image dropdown */}
        <div className="dropdown-container relative">
          <ToolbarButton
  onClick={() => {
    // Create a hidden file input element for image upload
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (event) => {
      if (input.files?.length) {
        const file = input.files[0];
        
        // Check file size (limit to 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          toast.error("Image too large. Maximum size is 5MB.");
          return;
        }
        
        // Create a temporary URL for preview while uploading
        const tempUrl = URL.createObjectURL(file);
        
        // Show loading indicator
        const loadingToast = toast.loading("Uploading image...");
        
        try {
          // Create form data for file upload
          const formData = new FormData();
          formData.append('file', file);
          formData.append('collabId', collabId); // Ensure this prop is passed to EditorToolbar
          
          // Use your existing upload API or the new one we defined
          const response = await fetch('/api/documents/upload-image', {
            method: 'POST',
            body: formData,
          });
          
          if (!response.ok) {
            throw new Error('Failed to upload image');
          }
          
          const data = await response.json();
          
          // Insert the image with the returned URL and default attributes
          editor.chain().focus().insertContent({
            type: 'enhancedImage',
            attrs: { 
              src: data.imageUrl,
              alt: file.name,
              title: file.name,
              width: '75%',
              alignment: 'center',
            }
          }).run();
          
          // Revoke the temporary object URL to free memory
          URL.revokeObjectURL(tempUrl);
          
          toast.dismiss(loadingToast);
          toast.success("Image uploaded successfully");
        } catch (error) {
          console.error('Upload error:', error);
          URL.revokeObjectURL(tempUrl);
          toast.dismiss(loadingToast);
          toast.error("Error uploading image");
        }
      }
    };
    
    input.click();
  }}
  title="Add Image"
  icon={<FaImage />}
/>
          
          {/* Option to add image by URL could go here */}
        </div>

        {/* Table dropdown */}
        <ToolbarDropdown
          title="Table Operations"
          icon={<FaTable />}
          isOpen={showTableMenu}
          toggleOpen={() => setShowTableMenu(!showTableMenu)}
          showChevron={false}
        >
          <div className="p-1 min-w-[200px]">
            <button
              onClick={() => {
                editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
                setShowTableMenu(false);
              }}
              className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
            >
              <FaTable className="mr-2" /> Insert Table (3×3)
            </button>
            
            {editor.isActive('table') && (
              <>
                <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                <button
                  onClick={() => {
                    editor.chain().focus().addColumnBefore().run();
                    setShowTableMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  disabled={!editor.can().addColumnBefore()}
                >
                  <FaColumns className="mr-2 transform -rotate-90" /> Add Column Before
                </button>
                <button
                  onClick={() => {
                    editor.chain().focus().addColumnAfter().run();
                    setShowTableMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  disabled={!editor.can().addColumnAfter()}
                >
                  <FaColumns className="mr-2 transform -rotate-90" /> Add Column After
                </button>
                <button
                  onClick={() => {
                    editor.chain().focus().addRowBefore().run();
                    setShowTableMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  disabled={!editor.can().addRowBefore()}
                >
                  <FaColumns className="mr-2" /> Add Row Before
                </button>
                <button
                  onClick={() => {
                    editor.chain().focus().addRowAfter().run();
                    setShowTableMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  disabled={!editor.can().addRowAfter()}
                >
                  <FaColumns className="mr-2" /> Add Row After
                </button>
                <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                <button
                  onClick={() => {
                    editor.chain().focus().deleteTable().run();
                    setShowTableMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center text-red-500"
                  disabled={!editor.can().deleteTable()}
                >
                  <FaTable className="mr-2" /> Delete Table
                </button>
              </>
            )}
          </div>
        </ToolbarDropdown>
      </>
    );
  }, [editor, showLinkMenu, linkUrl, showTableMenu]);

  // Color picker
  const colorPickerOption = useMemo(() => {
  if (!editor) return null;

  const isDarkMode = theme === 'dark';

  return (
    <ToolbarDropdown
      title="Text Color"
      icon={<FaPalette />}
      isOpen={showColorPicker}
      toggleOpen={() => setShowColorPicker(!showColorPicker)}
      showChevron={false}
    >
      <div className="p-2 w-48 z-40">
        <div className="grid grid-cols-3 gap-1 mb-2">
          {colorPresets.map((color) => {
            const colorValue = isDarkMode && color.darkValue ? color.darkValue : color.value;
            return (
              <button
                key={color.name}
                onClick={() => {
                  editor.chain().focus().setColor(colorValue).run();
                  setShowColorPicker(false);
                }}
                className="w-full p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex flex-col items-center justify-center"
                title={color.name}
              >
                <div
                  className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600 mb-1"
                  style={{ backgroundColor: colorValue }}
                ></div>
                <span className="text-xs truncate">{color.name}</span>
              </button>
            );
          })}
        </div>
        <button
          onClick={() => {
            editor.chain().focus().unsetColor().run();
            setShowColorPicker(false);
          }}
          className="w-full text-center px-2 py-1 text-xs rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 mt-1"
        >
          Reset to Default
        </button>
      </div>
    </ToolbarDropdown>
  );
}, [editor, showColorPicker, theme]);
  // History options
  const historyOptions = useMemo(() => {
    if (!editor) return null;

    return (
      <>
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
          icon={<FaUndo />}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
          icon={<FaRedo />}
        />
      </>
    );
  }, [editor]);

  const mobileCoreTools = useMemo(() => {
    if (!editor) return null;
    
    return (
      <>
        <ToolbarButton
          isActive={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold"
          icon={<FaBold />}
        />
        <ToolbarButton
          isActive={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic"
          icon={<FaItalic />}
        />
        <ToolbarButton
          isActive={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet List"
          icon={<FaListUl />}
        />
        <ToolbarButton
          isActive={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered List"
          icon={<FaListOl />}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
          icon={<FaUndo />}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
          icon={<FaRedo />}
        />
      </>
    );
  }, [editor]);

   const [showedMobileHint, setShowedMobileHint] = useState(false);

    // Mobile notice component
  const MobileEditorHint = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-700 p-2 mb-2 mx-2 rounded-r"
    >
      <div className="flex">
        <div className="flex-shrink-0 text-blue-500 dark:text-blue-400">
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Basic formatting tools are available on mobile. For advanced editing options like tables, colors, and more, please switch to a larger screen.
          </p>
          <button 
            className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1"
            onClick={() => setShowedMobileHint(true)}
          >
            Got it, don&apos;t show again
          </button>
        </div>
      </div>
    </motion.div>
  );

  if (!editor) {
    return <div className="h-12 bg-gray-100 dark:bg-gray-800 animate-pulse"></div>;
  }

  return (
    <div className="sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm transition-all duration-200">
      {isMobile ? (
        <div className="transition-all duration-300">
          {/* Show hint only once per session */}
          <AnimatePresence>
            {isMobile && !showedMobileHint && <MobileEditorHint />}
          </AnimatePresence>
          
          {/* Mobile Toolbar - Simplified, core functions only */}
          <div className="flex items-center justify-center p-1 overflow-x-auto scrollbar-hide gap-1">
            {mobileCoreTools}
          </div>
        </div>
      ) : (
        /* Desktop Toolbar */
        <div className="flex items-center p-1 scrollbar-hide">
          <div className="flex items-center">{formatOptions}</div>
          <ToolbarDivider />
          
          <div className="flex items-center">{headingOptions}</div>
          <ToolbarDivider />
          
          <div className="flex items-center">{listOptions}</div>
          <ToolbarDivider />
          
          <div className="flex items-center">{alignmentOptions}</div>
          <ToolbarDivider />
          
          <div className="flex items-center">{mediaOptions}</div>
          <ToolbarDivider />
          
          <div className="flex items-center">{colorPickerOption}</div>
          <ToolbarDivider />
          
          <div className="flex items-center">{historyOptions}</div>
        </div>
      )}
    </div>
  );
}