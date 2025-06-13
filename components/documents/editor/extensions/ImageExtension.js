import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import ImageComponent from '../components/ImageComponent';

export const ImageExtension = Node.create({
  name: 'enhancedImage',
  
  addOptions() {
    return {
      inline: false,
      HTMLAttributes: {},
    };
  },
  
  group: 'block',
  
  draggable: true,
  
  selectable: true,
  
  atom: true,
  
  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: '100%',
      },
      height: {
        default: 'auto',
      },
      alignment: {
        default: 'center', // center, left, right
      }
    };
  },
  
  parseHTML() {
    return [
      {
        tag: 'div[data-enhanced-image] img',
        getAttrs: el => ({
          src: el.getAttribute('src'),
          alt: el.getAttribute('alt'),
          title: el.getAttribute('title'),
          width: el.style.width,
          height: el.style.height,
          alignment: el.dataset.alignment || 'center',
        }),
      },
    ];
  },
  
  renderHTML({ HTMLAttributes }) {
    const { alignment, ...attrs } = HTMLAttributes;
    
    return ['div', { 
      'data-enhanced-image': '',
      'data-alignment': alignment,
      style: `text-align: ${alignment}`,
    }, ['img', mergeAttributes(this.options.HTMLAttributes, attrs)]];
  },
  
  addNodeView() {
    return ReactNodeViewRenderer(ImageComponent);
  },
});