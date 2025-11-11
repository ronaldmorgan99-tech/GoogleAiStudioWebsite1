import React, { useState, useEffect } from 'react';
import { XIcon } from './icons';

interface CreateThreadModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryTitle: string;
  onAddThread: (title: string, body: string) => void;
}

const CreateThreadModal: React.FC<CreateThreadModalProps> = ({ isOpen, onClose, categoryTitle, onAddThread }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    // Reset form when modal opens
    if (isOpen) {
      setTitle('');
      setBody('');
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && body.trim()) {
      onAddThread(title, body);
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity"
      aria-labelledby="modal-title-create-post"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div 
        className="bg-cz-gray-dark rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-2xl mx-4 transform transition-all"
        onClick={e => e.stopPropagation()} // Prevent closing modal when clicking inside
      >
        <div className="flex justify-between items-center mb-6">
          <h2 id="modal-title-create-post" className="text-2xl font-bold text-white">
            Create New Thread in <span className="text-cz-primary">{categoryTitle}</span>
          </h2>
          <button onClick={onClose} className="text-cz-text-dark hover:text-white transition-colors">
            <span className="sr-only">Close</span>
            <XIcon />
          </button>
        </div>

        <form onSubmit={handleFormSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="post-title" className="block text-sm font-medium text-cz-text-dark mb-1">
                Subject
              </label>
              <input
                type="text"
                name="post-title"
                id="post-title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-cz-gray border border-cz-gray-light rounded-md py-2 px-3 text-cz-text focus:ring-cz-primary focus:border-cz-primary transition"
                placeholder="Enter a descriptive title..."
              />
            </div>
            <div>
              <label htmlFor="post-body" className="block text-sm font-medium text-cz-text-dark mb-1">
                Body
              </label>
              <textarea
                name="post-body"
                id="post-body"
                required
                rows={10}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full bg-cz-gray border border-cz-gray-light rounded-md py-2 px-3 text-cz-text focus:ring-cz-primary focus:border-cz-primary transition"
                placeholder="Share your thoughts..."
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="text-cz-text bg-cz-gray hover:bg-cz-gray-light px-4 py-2.5 rounded-md text-sm font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-white bg-cz-primary hover:bg-cz-primary-hover px-4 py-2.5 rounded-md text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cz-gray-dark focus:ring-cz-primary"
            >
              Post Thread
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateThreadModal;
