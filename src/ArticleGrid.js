// ArticleGrid.js
import React, { useEffect, useRef, useState, useCallback } from 'react';
import ArticleCard from './ArticleCard';

const ArticleGrid = ({ posts, onArticleClick }) => {
  const containerRef = useRef(null);
  const cardRefs = useRef({});
  const [layout, setLayout] = useState([]);
  const [isReady, setIsReady] = useState(false);

  // Debounce function to prevent rapid-fire updates
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

  // Single layout calculation function
  const calculateLayout = useCallback(() => {
    if (!containerRef.current || posts.length === 0) {
      setLayout([]);
      setIsReady(true);
      return;
    }

    // Check if all card refs are available
    const allRefsReady = posts.every(post => cardRefs.current[post.slug]);
    
    if (!allRefsReady) {
      setIsReady(false);
      return;
    }

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
      
      // Use actual measured height
      const cardElement = cardRefs.current[post.slug];
      const actualHeight = cardElement ? cardElement.offsetHeight : 100;
      
      columnHeights[shortestCol] += actualHeight + gap;
    });
    
    setLayout(newLayout);
    setIsReady(true);
  }, [posts]);

  // Debounced version for resize events
  const debouncedCalculateLayout = useCallback(
    debounce(calculateLayout, 150),
    [calculateLayout]
  );

  // Clean up refs when posts change
  useEffect(() => {
    // Clear old refs that are no longer needed
    const currentSlugs = new Set(posts.map(post => post.slug));
    Object.keys(cardRefs.current).forEach(slug => {
      if (!currentSlugs.has(slug)) {
        delete cardRefs.current[slug];
      }
    });
    
    setIsReady(false);
    
    // If we already have all refs, calculate immediately
    const allRefsReady = posts.every(post => cardRefs.current[post.slug]);
    if (allRefsReady) {
      calculateLayout();
    }
  }, [posts, calculateLayout]);

  // Handle window resize
  useEffect(() => {
    window.addEventListener('resize', debouncedCalculateLayout);
    return () => {
      window.removeEventListener('resize', debouncedCalculateLayout);
    };
  }, [debouncedCalculateLayout]);

  // Handle card ref registration
  const handleCardRef = useCallback((slug, element) => {
    if (element) {
      cardRefs.current[slug] = element;
      
      // Check if this was the last ref we were waiting for
      const allRefsReady = posts.every(post => cardRefs.current[post.slug]);
      
      if (allRefsReady && !isReady) {
        // Small delay to ensure the element is fully rendered
        setTimeout(calculateLayout, 10);
      }
    }
  }, [posts, calculateLayout, isReady]);

  const maxHeight = layout.length > 0 ? Math.max(...layout.map(item => item.y)) + 200 : 400;

  return (
    <div 
      ref={containerRef}
      style={{ 
        position: 'relative',
        width: '100%',
        height: maxHeight + 'px',
        opacity: isReady ? 1 : 0.3,
        transition: 'opacity 0.2s ease'
      }}
    >
      {layout.map((item) => (
        <div
          key={item.post.slug}
          style={{
            position: 'absolute',
            left: item.x + 'px',
            top: item.y + 'px',
            width: '180px',
            opacity: isReady ? 1 : 0,
            transition: 'opacity 0.3s ease'
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