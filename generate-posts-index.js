const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const POSTS_DIR = path.join(__dirname, 'public', 'posts');
const INDEX_FILE = path.join(POSTS_DIR, 'posts-index.json');

function generatePostsIndex() {
  console.log('🔍 Scanning for markdown files...');
  
  // Ensure posts directory exists
  if (!fs.existsSync(POSTS_DIR)) {
    console.log('📁 Creating posts directory...');
    fs.mkdirSync(POSTS_DIR, { recursive: true });
    console.log('✅ Created public/posts/ directory');
    console.log('📝 Add your .md files to public/posts/ and restart');
    return;
  }

  // Read all files in posts directory
  const files = fs.readdirSync(POSTS_DIR);
  const markdownFiles = files.filter(file => file.endsWith('.md'));
  
  if (markdownFiles.length === 0) {
    console.log('📝 No markdown files found in public/posts/');
    console.log('   Add your .md files to public/posts/ and restart');
    return;
  }

  console.log(`📄 Found ${markdownFiles.length} markdown files`);

  const posts = [];
  
  for (const filename of markdownFiles) {
    try {
      const filePath = path.join(POSTS_DIR, filename);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const parsed = matter(fileContent);
      
      // Validate required fields
      const { title, date, categories } = parsed.data;
      
      if (!title) {
        console.warn(`⚠️  Skipping ${filename}: Missing 'title' in frontmatter`);
        continue;
      }
      
      if (!date) {
        console.warn(`⚠️  Skipping ${filename}: Missing 'date' in frontmatter`);
        continue;
      }
      
      if (!categories || !Array.isArray(categories)) {
        console.warn(`⚠️  Skipping ${filename}: Missing or invalid 'categories' in frontmatter`);
        continue;
      }

      // Generate slug from filename (remove .md extension)
      const slug = filename.replace('.md', '');
      
      const post = {
        slug,
        filename,
        title,
        categories,
        date
      };
      
      posts.push(post);
      console.log(`✅ Processed: ${filename}`);
      
    } catch (error) {
      console.warn(`⚠️  Skipping ${filename}: ${error.message}`);
    }
  }

  if (posts.length === 0) {
    console.log('❌ No valid posts found');
    return;
  }

  // Sort posts by date (newest first)
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Write the index file
  try {
    fs.writeFileSync(INDEX_FILE, JSON.stringify(posts, null, 2));
    console.log(`📝 Generated posts-index.json with ${posts.length} posts`);
    console.log('🎉 Ready to go!');
  } catch (error) {
    console.error('❌ Error writing posts-index.json:', error.message);
    process.exit(1);
  }
}

// Run the script
generatePostsIndex();