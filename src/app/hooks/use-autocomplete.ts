import { useState, useRef, useEffect, useMemo, useCallback } from 'react';

export interface UseAutocompleteOptions<T> {
  items: T[];
  filter: (item: T, query: string) => boolean;
  getDisplay: (item: T) => string;
  onSelect: (item: T) => void;
  initialQuery?: string;
}

export interface UseAutocompleteReturn<T> {
  query: string;
  setQuery: (value: string) => void;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  highlighted: number;
  setHighlighted: (value: number) => void;
  filteredItems: T[];
  listRef: React.LegacyRef<HTMLDivElement>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleSelect: (item: T) => void;
  reset: () => void;
}

export function useAutocomplete<T>({
  items,
  filter,
  getDisplay,
  onSelect,
  initialQuery = '',
}: UseAutocompleteOptions<T>): UseAutocompleteReturn<T> {
  const [query, setQuery] = useState(initialQuery);
  const [isOpen, setIsOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const filteredItems = useMemo(() => {
    const trimmed = query.trim();
    if (trimmed === '') return items;
    return items.filter((item) => filter(item, trimmed.toLowerCase()));
  }, [items, query, filter]);

  useEffect(() => {
    if (highlighted >= filteredItems.length && filteredItems.length > 0) {
      setHighlighted(0);
    }
  }, [filteredItems.length, highlighted]);

  const scrollHighlightedIntoView = useCallback(() => {
    const node = listRef.current?.querySelector(`[data-index="${highlighted}"]`);
    if (node) {
      node.scrollIntoView({ block: 'nearest' });
    }
  }, [highlighted]);

  const handleSelect = useCallback(
    (item: T) => {
      setQuery(getDisplay(item));
      setIsOpen(false);
      setHighlighted(0);
      onSelect(item);
    },
    [getDisplay, onSelect]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlighted((prev) =>
          prev < filteredItems.length - 1 ? prev + 1 : prev
        );
        requestAnimationFrame(scrollHighlightedIntoView);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlighted((prev) => (prev > 0 ? prev - 1 : 0));
        requestAnimationFrame(scrollHighlightedIntoView);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const item = filteredItems[highlighted];
        if (item) {
          handleSelect(item);
        }
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    },
    [filteredItems, highlighted, scrollHighlightedIntoView, handleSelect]
  );

  const reset = useCallback(() => {
    setQuery(initialQuery);
    setIsOpen(false);
    setHighlighted(0);
  }, [initialQuery]);

  return {
    query,
    setQuery,
    isOpen,
    setIsOpen,
    highlighted,
    setHighlighted,
    filteredItems,
    listRef,
    handleKeyDown,
    handleSelect,
    reset,
  };
}