// ArticleGrid.js
import React, { useEffect, useRef, useState } from 'react';
import ArticleCard from './ArticleCard';

const ArticleGrid = ({ posts, onArticleClick }) => {
  const containerRef = useRef(null);
  const cardRefs = useRef({});
  const [layout, setLayout] = useState([]);

  useEffect(() => {
    const calculateLayout = () => {
      if (!containerRef.current || posts.length === 0) return;
      
      const containerWidth = containerRef.current.offsetWidth;
      const cardWidth = 180;
      const gap = 4;
      const cols = Math.floor((containerWidth + gap) / (cardWidth + gap));
      const totalUsedWidth = cols * cardWidth + (cols - 1) * gap;
      const leftoverSpace = containerWidth - totalUsedWidth;
      const extraSpacing = leftoverSpace / (cols - 1);
      const actualGap = gap + extraSpacing;
      
      // Initialize column heights
      const columnHeights = new Array(cols).fill(0);
      const newLayout = [];
      
      posts.forEach((post, index) => {
        // Find shortest column
        const shortestCol = columnHeights.indexOf(Math.min(...columnHeights));
        
        // Position for this card
        const x = shortestCol * (cardWidth + actualGap);
        const y = columnHeights[shortestCol];
        
        newLayout.push({ x, y, post, index });
        
        // Get actual height if card is rendered, otherwise estimate
        const cardRef = cardRefs.current[post.slug];
        const actualHeight = cardRef ? cardRef.offsetHeight : 100;
        
        columnHeights[shortestCol] += actualHeight + gap;
      });
      
      setLayout(newLayout);
    };

    // Initial calculation
    calculateLayout();
    
    // Recalculate after cards are rendered
    const timer = setTimeout(calculateLayout, 100);
    
    window.addEventListener('resize', calculateLayout);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculateLayout);
    };
  }, [posts]);

  const handleCardRef = (slug, element) => {
    cardRefs.current[slug] = element;
    // Recalculate layout when card heights are known
    if (element) {
      setTimeout(() => {
        const calculateLayout = () => {
          if (!containerRef.current) return;
          
          const containerWidth = containerRef.current.offsetWidth;
          const cardWidth = 180;
          const gap = 4;
          const cols = Math.floor((containerWidth + gap) / (cardWidth + gap));
          const totalUsedWidth = cols * cardWidth + (cols - 1) * gap;
          const leftoverSpace = containerWidth - totalUsedWidth;
          const extraSpacing = leftoverSpace / (cols - 1);
          const actualGap = gap + extraSpacing;
          
          const columnHeights = new Array(cols).fill(0);
          const newLayout = [];
          
          posts.forEach((post) => {
            const shortestCol = columnHeights.indexOf(Math.min(...columnHeights));
            const x = shortestCol * (cardWidth + actualGap);
            const y = columnHeights[shortestCol];
            
            newLayout.push({ x, y, post });
            
            const cardRef = cardRefs.current[post.slug];
            const actualHeight = cardRef ? cardRef.offsetHeight : 100;
            columnHeights[shortestCol] += actualHeight + gap;
          });
          
          setLayout(newLayout);
        };
        
        calculateLayout();
      }, 10);
    }
  };

  const maxHeight = layout.length > 0 ? Math.max(...layout.map(item => item.y)) + 200 : 0;

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