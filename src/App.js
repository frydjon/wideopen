// App.js
import React, { useState, useEffect } from 'react';
import Header from './Header';
import Homepage from './Homepage';
import ArticlePage from './ArticlePage';
import { matter, parseMarkdown } from './utils';

const App = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentView, setCurrentView] = useState('home');
  const [currentArticle, setCurrentArticle] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      // Load the auto-generated index
      const response = await fetch('/posts/posts-index.json');
      const postsIndex = await response.json();
      
      // Load snippets for all posts
      const postsWithSnippets = await Promise.all(
        postsIndex.map(async (postInfo) => {
          try {
            const postResponse = await fetch(`/posts/${postInfo.filename}`);
            const content = await postResponse.text();
            const parsed = matter(content);
            const [snippet] = parsed.content.split('<!--endSnippet-->');
            
            return {
              ...postInfo,
              snippet: snippet.trim(),
              parsedSnippet: parseMarkdown(snippet.trim(), true)
            };
          } catch (error) {
            console.error(`Error loading snippet for ${postInfo.filename}:`, error);
            return {
              ...postInfo,
              snippet: 'Error loading preview...'
            };
          }
        })
      );

      setPosts(postsWithSnippets);

      // Extract unique categories
      const allCategories = [...new Set(postsWithSnippets.flatMap(post => post.categories))];
      setCategories(allCategories);
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  };

  const showArticle = async (slug) => {
    const postInfo = posts.find(post => post.slug === slug);
    if (!postInfo) return;

    try {
      const response = await fetch(`/posts/${postInfo.filename}`);
      const content = await response.text();
      const parsed = matter(content);
      
      const fullArticle = {
        ...postInfo,
        fullContent: parsed.content
      };
      
      setCurrentArticle(fullArticle);
      setCurrentView('article');
    } catch (error) {
      console.error(`Error loading article ${slug}:`, error);
    }
  };

  const showHome = () => {
    setCurrentView('home');
    setCurrentArticle(null);
    setSelectedCategory(null);
  };

  const showCategory = (category) => {
    setSelectedCategory(category);
    setCurrentView('home');
    setCurrentArticle(null);
  };

  // Filter posts based on selected category
  const filteredPosts = selectedCategory 
    ? posts.filter(post => post.categories.includes(selectedCategory))
    : posts;

  return (
    <div style={{ fontFamily: 'Times New Roman, serif', color: '#000', backgroundColor: '#fff' }}>
      {currentView === 'home' ? (
        <>
          <Header 
            categories={categories} 
            onHomeClick={showHome} 
            onCategoryClick={showCategory}
            selectedCategory={selectedCategory}
          />
          <Homepage posts={filteredPosts} onArticleClick={showArticle} />
        </>
      ) : (
        <ArticlePage 
          article={currentArticle} 
          onBackClick={showHome} 
          categories={categories}
          onCategoryClick={showCategory}
          selectedCategory={selectedCategory}
        />
      )}
    </div>
  );
};

export default App;