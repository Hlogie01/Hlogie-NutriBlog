// backend/server.js

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const postsFilePath = path.join(__dirname, 'data', 'posts.json');

// Helper function to read posts from the file
const readPosts = () => {
  const data = fs.readFileSync(postsFilePath, 'utf-8');
  return JSON.parse(data);
};

// Helper function to write posts to the file
const writePosts = (posts) => {
  fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2));
};

// Get all posts
app.get('/api/posts', (req, res) => {
  const posts = readPosts();
  res.json(posts);
});

// Get a single post by ID
app.get('/api/posts/:id', (req, res) => {
  const { id } = req.params;
  const posts = readPosts();
  const post = posts.find((p) => p.id === id);
  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
});

// Create a new post
app.post('/api/posts', (req, res) => {
  const posts = readPosts();
  const newPost = { id: `${Date.now()}`, ...req.body, comments: [] };
  posts.push(newPost);
  writePosts(posts);
  res.status(201).json(newPost);
});

// Add a comment to a post
app.post('/api/posts/:id/comments', (req, res) => {
  const { id } = req.params;
  const posts = readPosts();
  const post = posts.find((p) => p.id === id);
  if (post) {
    const newComment = { text: req.body.text };
    post.comments.push(newComment);
    writePosts(posts);
    res.status(201).json(newComment);
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
