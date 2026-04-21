import * as React from 'react';
import { Plus, X } from 'lucide-react';
import { cn } from '../../ui/utils';

interface TagInputProps {
  /**
   * Array of current tags
   */
  tags: string[];
  /**
   * Callback when tags change
   */
  onTagsChange: (tags: string[]) => void;
  /**
   * Placeholder text for the input
   */
  placeholder?: string;
  /**
   * Label for the field
   */
  label?: string;
  /**
   * Whether the field is required
   */
  required?: boolean;
  /**
   * Error message
   */
  error?: string;
  /**
   * Help text
   */
  helpText?: string;
  /**
   * Optional additional class names
   */
  className?: string;
}

/**
 * TagInput - A reusable tag input component for managing multiple values
 * 
 * Usage:
 * ```tsx
 * const [amenities, setAmenities] = useState(['Piscina', 'Gimnasio']);
 * 
 * <TagInput
 *   label="Amenidades"
 *   tags={amenities}
 *   onTagsChange={setAmenities}
 *   placeholder="Agregar amenidad..."
 * />
 * ```
 */
export function TagInput({
  tags,
  onTagsChange,
  placeholder = 'Agregar...',
  label,
  required = false,
  error,
  helpText,
  className,
}: TagInputProps) {
  const [newTag, setNewTag] = React.useState('');

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      onTagsChange([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
          >
            {tag}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="hover:text-blue-900 focus:outline-none"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className={cn(
            'flex-1 px-4 py-2 border border-gray-300 rounded-lg',
            'focus:outline-none focus:ring-2 focus:ring-blue-500',
            error && 'border-red-500 focus:ring-red-500'
          )}
        />
        <button
          type="button"
          onClick={handleAddTag}
          disabled={!newTag.trim()}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg font-medium',
            'bg-blue-50 text-blue-700 hover:bg-blue-100',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-colors'
          )}
        >
          <Plus className="w-4 h-4" />
          Agregar
        </button>
      </div>
      
      {helpText && !error && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
