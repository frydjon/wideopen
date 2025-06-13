// ArticleCard.js
import React, { useEffect, useRef } from 'react';

const ArticleCard = ({ post, onClick, onRef }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current && onRef) {
      onRef(cardRef.current);
    }
  }, [onRef]);

  return (
    <article 
      ref={cardRef}
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
        fontSize: '0.75rem', 
        fontWeight: 'bold', 
        color: '#000', 
        marginBottom: '0.2rem', 
        lineHeight: '1.2',
        margin: '0 0 0.2rem 0',
        textAlign: 'center'
      }}>
        {post.title}
      </h2>
      
      <div style={{ 
        color: '#666', 
        fontSize: '0.5rem', 
        marginBottom: '0.3rem',
        fontStyle: 'italic',
        textAlign: 'center'
      }}>
        {new Date(post.date).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </div>
      
      <div 
        style={{ 
          color: '#000', 
          fontSize: '0.55rem', 
          lineHeight: '1.3',
          marginBottom: '0.3rem'
        }}
        dangerouslySetInnerHTML={{ 
          __html: post.parsedSnippet || post.snippet 
        }}
      />
      
      <div style={{ 
        color: '#0066cc', 
        fontSize: '0.5rem', 
        textAlign: 'center',
        marginTop: 'auto'
      }}>
        Continue reading
      </div>
    </article>
  );
};

export default ArticleCard;