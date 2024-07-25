// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const postsFilePath = path.join(__dirname, 'posts.json');

// Ensure posts.json file exists
if (!fs.existsSync(postsFilePath)) {
  fs.writeFileSync(postsFilePath, JSON.stringify([]));
}

// Get all posts
app.get('/posts', (req, res) => {
  const posts = JSON.parse(fs.readFileSync(postsFilePath, 'utf8'));
  res.json(posts);
});

// Add a new post
app.post('/posts', (req, res) => {
  const newPost = req.body;
  const posts = JSON.parse(fs.readFileSync(postsFilePath, 'utf8'));
  posts.push(newPost);
  fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2));
  res.status(201).json(newPost);
});

// Add a new comment to a post
app.post('/posts/:id/comments', (req, res) => {
  const postId = req.params.id;
  const newComment = req.body;
  const posts = JSON.parse(fs.readFileSync(postsFilePath, 'utf8'));
  const postIndex = posts.findIndex(post => post.id === postId);

  if (postIndex !== -1) {
    posts[postIndex].comments.push(newComment);
    fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2));
    res.status(201).json(newComment);
  } else {
    res.status(404).send('Post not found');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
