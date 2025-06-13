import React, { useState } from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { FaTrash, FaAlignLeft, FaAlignCenter, FaAlignRight, FaExpand, FaCompress } from 'react-icons/fa';

export default function ImageComponent({ node, updateAttributes, deleteNode, selected }) {
  const [showControls, setShowControls] = useState(false);

  const handleResize = (percent) => {
    updateAttributes({
      width: `${percent}%`,
    });
  };

  const handleAlign = (alignment) => {
    updateAttributes({
      alignment,
    });
  };

  return (
    <NodeViewWrapper 
      className={`image-component relative my-4 ${selected ? 'selected' : ''}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      data-alignment={node.attrs.alignment}
    >
      <div className={`image-container ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ textAlign: node.attrs.alignment }}>
        <img 
          src={node.attrs.src} 
          alt={node.attrs.alt || ''} 
          title={node.attrs.title || ''} 
          width={node.attrs.width}
          height={node.attrs.height}
          className="max-w-full rounded-md"
          style={{ display: 'inline-block' }}
        />
        
        {(selected || showControls) && (
          <div className="image-controls absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-md shadow-md p-1 flex space-x-1 z-10">
            <button 
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              onClick={() => handleAlign('left')}
              title="Align left"
            >
              <FaAlignLeft className={node.attrs.alignment === 'left' ? 'text-blue-500' : ''} />
            </button>
            <button 
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              onClick={() => handleAlign('center')}
              title="Align center"
            >
              <FaAlignCenter className={node.attrs.alignment === 'center' ? 'text-blue-500' : ''} />
            </button>
            <button 
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              onClick={() => handleAlign('right')}
              title="Align right"
            >
              <FaAlignRight className={node.attrs.alignment === 'right' ? 'text-blue-500' : ''} />
            </button>
            <div className="h-4 w-px bg-gray-300 dark:bg-gray-600 mx-1" />
            <button 
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              onClick={() => handleResize(50)}
              title="Small"
            >
              <FaCompress />
            </button>
            <button 
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              onClick={() => handleResize(75)}
              title="Medium"
            >
              <FaCompress className="text-lg" />
            </button>
            <button 
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              onClick={() => handleResize(100)}
              title="Large"
            >
              <FaExpand />
            </button>
            <div className="h-4 w-px bg-gray-300 dark:bg-gray-600 mx-1" />
            <button 
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-red-500"
              onClick={() => deleteNode()}
              title="Delete image"
            >
              <FaTrash />
            </button>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
}