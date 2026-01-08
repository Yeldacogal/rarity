import { useState, useEffect } from 'react';
import { Tag } from '../types';
import api from '../lib/api';

interface TagSelectorProps {
  selectedTags: number[];
  onChange: (tagIds: number[]) => void;
}

export default function TagSelector({ selectedTags, onChange }: TagSelectorProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await api.get('/tags');
        setTags(response.data);
      } catch (error) {
        console.error('Failed to fetch tags:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTags();
  }, []);

  const toggleTag = (tagId: number) => {
    if (selectedTags.includes(tagId)) {
      onChange(selectedTags.filter((id) => id !== tagId));
    } else {
      onChange([...selectedTags, tagId]);
    }
  };

  if (isLoading) {
    return (
      <div className="flex gap-2 flex-wrap">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-20 h-8 bg-gray-200 animate-pulse rounded"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {tags.map((tag) => (
        <button
          key={tag.id}
          type="button"
          onClick={() => toggleTag(tag.id)}
          className={`px-3 py-1 rounded-lg border-2 transition-all ${
            selectedTags.includes(tag.id)
              ? 'bg-rose-500 text-white border-rose-500'
              : 'bg-white text-rose-600 border-rose-300 hover:border-rose-400'
          }`}
        >
          {tag.name}
        </button>
      ))}
    </div>
  );
}
