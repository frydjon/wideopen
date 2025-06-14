// ArticleGrid.js
import React, { useEffect, useRef, useState, useCallback } from 'react';
import ArticleCard from './ArticleCard';

const ArticleGrid = ({ posts, onArticleClick }) => {
  const containerRef = useRef(null);
  const cardRefs = useRef({});
  const [layout, setLayout] = useState([]);

  // Clean up refs when posts change
  useEffect(() => {
    const currentSlugs = new Set(posts.map(post => post.slug));
    Object.keys(cardRefs.current).forEach(slug => {
      if (!currentSlugs.has(slug)) {
        delete cardRefs.current[slug];
      }
    });
  }, [posts]);

  // Single layout calculation function
  const calculateLayout = useCallback(() => {
    if (!containerRef.current || posts.length === 0) return;
    
    const containerWidth = containerRef.current.offsetWidth;
    const cardWidth = 180;
    const gap = 4;
    const cols = Math.floor((containerWidth + gap) / (cardWidth + gap));
    
    if (cols <= 0) return;
    
    const totalUsedWidth = cols * cardWidth + (cols - 1) * gap;
    const leftoverSpace = containerWidth - totalUsedWidth;
    const extraSpacing = leftoverSpace / Math.max(cols - 1, 1);
    const actualGap = gap + extraSpacing;
    
    // Initialize column heights
    const columnHeights = new Array(cols).fill(0);
    const newLayout = [];
    
    posts.forEach((post) => {
      // Find shortest column
      const shortestCol = columnHeights.indexOf(Math.min(...columnHeights));
      
      // Position for this card
      const x = shortestCol * (cardWidth + actualGap);
      const y = columnHeights[shortestCol];
      
      newLayout.push({ x, y, post });
      
      // Use actual height if available, otherwise estimate
      const cardElement = cardRefs.current[post.slug];
      const actualHeight = cardElement ? cardElement.offsetHeight : 120;
      
      columnHeights[shortestCol] += actualHeight + gap;
    });
    
    setLayout(newLayout);
  }, [posts]);

  // Debounce for resize
  const debounce = useCallback((func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }, []);

  const debouncedCalculateLayout = useCallback(
    debounce(calculateLayout, 100),
    [calculateLayout]
  );

  // Initial layout calculation
  useEffect(() => {
    calculateLayout();
    
    // Recalculate after a short delay to get actual heights
    const timer = setTimeout(calculateLayout, 50);
    
    window.addEventListener('resize', debouncedCalculateLayout);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', debouncedCalculateLayout);
    };
  }, [calculateLayout, debouncedCalculateLayout]);

  // Handle card ref registration - simplified
  const handleCardRef = useCallback((slug, element) => {
    if (element) {
      cardRefs.current[slug] = element;
      
      // Only recalculate if we don't have a layout yet, or after a delay
      if (layout.length === 0) {
        setTimeout(calculateLayout, 20);
      }
    }
  }, [calculateLayout, layout.length]);

  const maxHeight = layout.length > 0 ? Math.max(...layout.map(item => item.y)) + 200 : 400;

  return (
    <div 
      ref={containerRef}
      style={{ 
        position: 'relative',
        width: '100%',
        height: maxHeight + 'px'
      }}
    >
      {layout.map((item) => (
        <div
          key={item.post.slug}
          style={{
            position: 'absolute',
            left: item.x + 'px',
            top: item.y + 'px',
            width: '180px'
          }}
        >
          <ArticleCard 
            post={item.post} 
            onClick={() => onArticleClick(item.post.slug)}
            onRef={(el) => handleCardRef(item.post.slug, el)}
          />
        </div>
      ))}
    </div>
  );
};

export default ArticleGrid;