// utils.js
// Simple markdown parser (in real app, you'd use a proper markdown library)
export const parseMarkdown = (content, isSnippet = false) => {
 // Adjust font sizes for snippets (card view)
 const h1Size = isSnippet ? '0.6rem' : '2rem';
 const h2Size = isSnippet ? '0.58rem' : '1.5rem';
 const h3Size = isSnippet ? '0.56rem' : '1.2rem';
 const h4Size = isSnippet ? '0.54rem' : '1rem';
 const h1Margin = isSnippet ? '0.2rem 0 0.1rem 0' : '2rem 0 1rem 0';
 const h2Margin = isSnippet ? '0.15rem 0 0.05rem 0' : '1.5rem 0 1rem 0';
 const h3Margin = isSnippet ? '0.1rem 0 0.05rem 0' : '1rem 0 0.5rem 0';
 const h4Margin = isSnippet ? '0.1rem 0 0.05rem 0' : '0.8rem 0 0.4rem 0';
 const pMargin = isSnippet ? '0.1rem 0' : '1rem 0';
 const codeSize = isSnippet ? '0.48rem' : '0.9em';

 return content
   // Process smart galleries first
   .replace(/^smartGallery\s+(\d+)x(\d+)(?:\s+(\d+)px)?\s*\n((?:https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp|svg)\s*\n?)*)/gm, (match, cols, rows, width, imageUrls) => {
     const urls = imageUrls.trim().split('\n').filter(url => url.trim().length > 0);
     const maxImages = parseInt(cols) * parseInt(rows);
     const displayUrls = urls.slice(0, maxImages);
     
     const imageElements = displayUrls.map(url => 
       `<img src="${url.trim()}" alt="Gallery image" style="width: 100%; height: 100%; object-fit: cover; border-radius: 2px;" />`
     ).join('');
     
     // Use full width if no width specified, otherwise use the specified width
     const galleryWidth = width ? `max-width: ${width}px;` : 'width: 100%;';
     
     return `<div style="display: grid; grid-template-columns: repeat(${cols}, 1fr); grid-template-rows: repeat(${rows}, 1fr); gap: 4px; ${galleryWidth} margin: 0.5rem auto; aspect-ratio: ${cols}/${rows};">${imageElements}</div>`;
   })
   // Process markdown images
   .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto; margin: 0.1rem 0; display: block;" />')
   // Process standalone image URLs with optional width
   .replace(/^(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|svg))(\s+(\d+)px)?$/gm, (match, url, ext, widthPart, width) => {
     const widthStyle = width ? `width: ${width}px; max-width: 100%;` : 'max-width: 100%;';
     return `<img src="${url}" alt="Image" style="${widthStyle} height: auto; margin: 0.1rem 0; display: block;" />`;
   })
   // Then headings
   .replace(/^# (.*$)/gm, `<h1 style="font-size: ${h1Size}; margin: ${h1Margin}; font-weight: bold; line-height: 1.2; text-align: center;">$1</h1>`)
   .replace(/^## (.*$)/gm, `<h2 style="font-size: ${h2Size}; margin: ${h2Margin}; font-weight: bold; line-height: 1.2; text-align: center;">$1</h2>`)
   .replace(/^### (.*$)/gm, `<h3 style="font-size: ${h3Size}; margin: ${h3Margin}; font-weight: bold; line-height: 1.2; text-align: center;">$1</h3>`)
   .replace(/^#### (.*$)/gm, `<h4 style="font-size: ${h4Size}; margin: ${h4Margin}; font-weight: bold; line-height: 1.2; text-align: center;">$1</h4>`)
   // Then text formatting
   .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
   .replace(/\*(.*?)\*/g, '<em>$1</em>')
   .replace(/`([^`]+)`/g, `<code style="background: #f5f5f5; padding: 0.1rem 0.2rem; border-radius: 2px; font-family: 'Courier New', monospace; font-size: ${codeSize};">$1</code>`)
   // Then links (after images to avoid conflicts)
   .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #0066cc; text-decoration: underline;">$1</a>')
   // Then lists
   .replace(/^- (.*$)/gm, '<li style="margin: 0.02rem 0; font-size: inherit;">$1</li>')
   .replace(/(<li.*<\/li>)/s, '<ul style="margin: 0.1rem 0; padding-left: 0.5rem;">$1</ul>')
   .replace(/^\d+\. (.*$)/gm, '<li style="margin: 0.02rem 0; font-size: inherit;">$1</li>')
   // Finally paragraphs
   .replace(/\n\n/g, `</p><p style="margin: ${pMargin};">`)
   .replace(/^(.)/gm, `<p style="margin: ${pMargin};">$1`)
   .replace(/<\/p><p[^>]*><h/g, '</p><h')
   .replace(/<\/h([1-6])><p[^>]*>/g, `</h$1><p style="margin: ${pMargin};">`)
   .replace(/<\/p><p[^>]*><ul/g, '</p><ul')
   .replace(/<\/ul><p[^>]*>/g, `</ul><p style="margin: ${pMargin};">`)
   .replace(/<\/p><p[^>]*><li/g, '</p><li')
   .replace(/<\/li><p[^>]*>/g, `</li><p style="margin: ${pMargin};">`)
   .replace(/<\/p><p[^>]*><img/g, '</p><img')
   .replace(/<\/img><p[^>]*>/g, `</img><p style="margin: ${pMargin};">`)
   .replace(/<\/p><p[^>]*><div/g, '</p><div')
   .replace(/<\/div><p[^>]*>/g, `</div><p style="margin: ${pMargin};">`);
};

// Mock gray-matter functionality
export const matter = (fileContent) => {
 const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
 const match = fileContent.match(frontmatterRegex);
 
 if (!match) {
   return { data: {}, content: fileContent };
 }
 
 const frontmatter = match[1];
 const content = match[2];
 
 // Parse YAML frontmatter (simplified)
 const data = {};
 frontmatter.split('\n').forEach(line => {
   const [key, ...valueParts] = line.split(':');
   if (key && valueParts.length > 0) {
     const value = valueParts.join(':').trim();
     if (value.startsWith('[') && value.endsWith(']')) {
       // Parse array
       data[key.trim()] = value.slice(1, -1).split(',').map(item => item.trim().replace(/"/g, ''));
     } else {
       data[key.trim()] = value.replace(/"/g, '');
     }
   }
 });
 
 return { data, content };
};