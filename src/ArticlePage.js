// ArticlePage.js
import React from 'react';
import { parseMarkdown } from './utils';
import Header from './Header';

const ArticlePage = ({ article, onBackClick, categories, onCategoryClick, selectedCategory }) => {
  if (!article) return null;

  console.log('ArticlePage rendering with article:', article.title);
  console.log('Full content length:', article.fullContent.length);
  
  const processedContent = parseMarkdown(article.fullContent.replace('<!--endSnippet-->', ''), false);
  console.log('Processed content length:', processedContent.length);

  return (
    <div>
      <Header 
        categories={categories} 
        onHomeClick={onBackClick} 
        onCategoryClick={onCategoryClick}
        selectedCategory={selectedCategory}
      />
      
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
        <article>
          <header style={{ marginBottom: '2rem' }}>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold', 
              marginBottom: '1rem',
              margin: '0 0 1rem 0',
              fontFamily: 'Times New Roman, serif',
              textAlign: 'center'
            }}>
              {article.title}
            </h1>
            <div style={{ 
              color: '#666', 
              fontSize: '0.9rem',
              margin: '0',
              fontFamily: 'Times New Roman, serif',
              textAlign: 'center',
              fontStyle: 'italic'
            }}>
              {new Date(article.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </header>
          
          <div 
            style={{ 
              lineHeight: '1.8', 
              fontSize: '1.1rem',
              fontFamily: 'Times New Roman, serif'
            }}
            dangerouslySetInnerHTML={{ 
              __html: processedContent
            }}
          />
        </article>
      </main>
    </div>
  );
};

export default ArticlePage;