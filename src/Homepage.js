// Homepage.js
import React from 'react';
import ArticleGrid from './ArticleGrid';

const Homepage = ({ posts, onArticleClick }) => {
  return (
    <main style={{ maxWidth: 'none', margin: '0', padding: '0 2rem' }}>
      <ArticleGrid posts={posts} onArticleClick={onArticleClick} />
    </main>
  );
};

export default Homepage;