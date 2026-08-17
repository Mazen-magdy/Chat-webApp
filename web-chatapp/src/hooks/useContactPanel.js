import { useEffect, useRef, useState } from 'react';

export function useContactPanel(r) {
  console.log(r);
  const searchRef = useRef(null);
  const iconRef = useRef(null);
  const resizeRef = useRef(null);
  const resizedRef = r;
  const dragData = useRef({
    lastX: 0,
    startX: 0,
    startWidth: 0,
    currentWidth: 0,
    dx: 0,
    isDrag: false,
  });
  const [searchState, setSearchState] = useState('');
  // search handler
  useEffect(() => {
    const searchInput = searchRef.current;
    const icon = iconRef.current;

    if (!searchInput || !icon) return;

    const handleFocus = () => icon.classList.add('disabled');
    const handleRelease = () => icon.classList.remove('disabled');

    searchInput.addEventListener('focus', handleFocus);
    searchInput.addEventListener('blur', handleRelease);

    return () => {
      searchInput.removeEventListener('focus', handleFocus);
      searchInput.removeEventListener('blur', handleRelease);
    };
  }, []);
  // resize handler
  useEffect(() => {
    const resizer = resizeRef.current;
    const panel = resizedRef.current;

    if (!resizer || !panel) return;

    const data = dragData.current;
    data.currentWidth = panel.getBoundingClientRect().width;
    data.dx = 0;

    const handleMouseDown = (event) => {
      data.isDrag = true;
      data.startX = event.clientX;
      data.startWidth = panel.getBoundingClientRect().width;
      panel.style.opacity = '0.8';
      panel.style.borderLeft = '1px solid var(--text-disabled)';
    };

    const handleMouseUp = () => {
      data.isDrag = false;
      panel.style.opacity = '';
      panel.style.borderLeft = '';
    };

    const handleMouseMove = (event) => {
      if (!data.isDrag) return;

      data.dx = event.clientX - data.startX;
      data.currentWidth = Math.max(500, data.startWidth + data.dx);
      panel.style.width = `${data.currentWidth}px`;
    };

    resizer.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      resizer.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  });

  return {
    searchRef,
    iconRef,
    resizeRef,
    resizedRef,
    searchState,
    setSearchState,
  };
}
