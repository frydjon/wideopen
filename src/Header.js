// Header.js
import React from 'react';

const Header = ({ categories, onHomeClick, onCategoryClick, selectedCategory }) => {
  return (
    <header style={{ 
      background: '#fff', 
      padding: '1rem 0', 
      marginBottom: '1rem' 
    }}>
      <div style={{ 
        maxWidth: 'none', 
        margin: '0', 
        padding: '0 0.2rem' 
      }}>
        <h1 
          onClick={onHomeClick}
          style={{ 
            fontSize: '3rem', 
            fontWeight: 'bold', 
            color: '#000', 
            textAlign: 'center', 
            marginBottom: '1rem',
            margin: '0 0 1rem 0',
            cursor: 'pointer',
            transition: 'opacity 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.opacity = '0.6'}
          onMouseLeave={(e) => e.target.style.opacity = '1'}
        >
          Wide Open
        </h1>
        <nav style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '3rem', 
          flexWrap: 'wrap' 
        }}>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => onCategoryClick(category)}
              style={{ 
                color: selectedCategory === category ? '#0066cc' : '#000', 
                background: 'none',
                border: 'none',
                textDecoration: 'none', 
                fontWeight: selectedCategory === category ? 'bold' : 'normal', 
                fontSize: '1.1rem',
                opacity: 1,
                transition: 'opacity 0.2s ease',
                cursor: 'pointer',
                fontFamily: 'Times New Roman, serif'
              }}
              onMouseEnter={(e) => e.target.style.opacity = '0.6'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              {category.charAt(0).toUpperCase() + category.replace('-', ' ').slice(1)}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;