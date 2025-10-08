// ArticleCard.js
import React from 'react';

const ArticleCard = ({ post, onClick }) => {
  return (
    <article 
      className="article-card"
      onClick={onClick}
      style={{ 
        background: '#fff', 
        padding: '0.5rem', 
        cursor: 'pointer', 
        transition: 'opacity 0.2s ease',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
      onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
    >
      <h2 style={{ 
        fontWeight: 'bold', 
        color: '#000', 
        marginBottom: '0.2rem', 
        lineHeight: '1.2',
        margin: '0 0 0.2rem 0',
        textAlign: 'center'
      }}>
        {post.title}
      </h2>
      
      <div 
        className="article-date"
        style={{ 
          color: '#666', 
          marginBottom: '0.3rem',
          fontStyle: 'italic',
          textAlign: 'center'
        }}
      >
        {new Date(post.date).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </div>
      
      <div 
        className="article-content"
        style={{ 
          color: '#000', 
          lineHeight: '1.3',
          marginBottom: '0.3rem'
        }}
        dangerouslySetInnerHTML={{ 
          __html: post.parsedSnippet || post.snippet 
        }}
      />
      
      <div 
        className="continue-reading"
        style={{ 
          color: '#0066cc', 
          textAlign: 'center',
          marginTop: 'auto'
        }}
      >
        Continue reading
      </div>
    </article>
  );
};

export default ArticleCard;