// Declaring and initializing dependencies
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');

const Post = require('./post');

const app = express();
app.use(express.json());
app.use(cors());

// Root Route
app.get('/', (req, res) => {
  res.json({
    message: 'The API is working 🚀',
  });
});

// Get All Posts
app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find({}).sort({ date: -1 });
    if (posts.length) {
      res.json(posts);
    } else {
      res.json({
        message: 'No posts found',
      });
    }
  } catch (err) {
    res.json({ message: err });
  }
});

// Create a New Post
app.post('/posts', async (req, res) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get a single post
app.get('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      res.json(post);
    } else {
      res.json({
        message: 'No post found',
      });
    }
  } catch (err) {
    res.json({ message: err });
  }
});

// Update a post
app.patch('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      post.set({
        title: req.body.title,
        content: req.body.content,
      });
      const updatedPost = await post.save();
      res.json(updatedPost);
    } else {
      res.json({
        message: 'No post found',
      });
    }
  } catch (error) {
    res.json({ message: error });
  }
});

// Delete a post
app.delete('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      await post.remove();
      res.json({
        message: 'Post deleted',
      });
    } else {
      res.json({
        message: 'No post found',
      });
    }
  } catch (error) {
    res.json({ message: error });
  }
});

// Connecting the application to the database
mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log('Connected to the database');
  }
);

// Initializing the Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
