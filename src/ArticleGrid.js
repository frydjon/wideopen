// ArticleGrid.js
import React from 'react';
import Masonry from 'react-masonry-css';
import ArticleCard from './ArticleCard';

const ArticleGrid = ({ posts, onArticleClick }) => {
  // Breakpoint columns for responsive design
  // Calculated based on 180px card width + 4px gap
  const breakpointColumnsObj = {
    default: 4,  // Max 4 columns for large screens
    768: 3,      // ~768px (3 * 184 + margins)
    584: 2,      // ~584px (2 * 184 + margins)
    400: 1       // Mobile (1 column)
  };

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="masonry-grid"
      columnClassName="masonry-grid-column"
    >
      {posts.map((post) => (
        <ArticleCard 
          key={post.slug}
          post={post} 
          onClick={() => onArticleClick(post.slug)}
        />
      ))}
    </Masonry>
  );
};

export default ArticleGrid;