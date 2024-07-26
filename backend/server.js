const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const postsFilePath = path.join(__dirname, 'posts.json');

app.get('/api/posts', (req, res) => {
  fs.readFile(postsFilePath, (err, data) => {
    if (err) throw err;
    const posts = JSON.parse(data);
    res.json(posts);
  });
});

app.get('/api/posts/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  fs.readFile(postsFilePath, (err, data) => {
    if (err) throw err;
    const posts = JSON.parse(data);
    const post = posts.find(p => p.id === postId);
    res.json(post);
  });
});

app.post('/api/posts/:id/comments', (req, res) => {
  const postId = parseInt(req.params.id);
  const newComment = req.body.comment;
  fs.readFile(postsFilePath, (err, data) => {
    if (err) throw err;
    let posts = JSON.parse(data);
    let post = posts.find(p => p.id === postId);
    if (post) {
      post.comments = post.comments || [];
      post.comments.push(newComment);
      fs.writeFile(postsFilePath, JSON.stringify(posts, null, 2), (err) => {
        if (err) throw err;
        res.status(200).json({ message: 'Comment added successfully' });
      });
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});