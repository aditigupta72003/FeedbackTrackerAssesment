const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'data', 'feedback.json');

// Enhanced CORS configuration
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.dirname(DATA_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Read feedback from file
async function readFeedback() {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is empty, return empty array
    return [];
  }
}

// Write feedback to file
async function writeFeedback(feedback) {
  await ensureDataDirectory();
  await fs.writeFile(DATA_FILE, JSON.stringify(feedback, null, 2));
}

// Routes

// GET /feedback - Get all feedback
app.get('/feedback', async (req, res) => {
  try {
    const feedback = await readFeedback();
    res.json(feedback);
  } catch (error) {
    console.error('Error reading feedback:', error);
    res.status(500).json({ error: 'Failed to read feedback' });
  }
});

// POST /feedback - Add new feedback
app.post('/feedback', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const newFeedback = {
      id: uuidv4(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      votes: 0,
      createdAt: new Date().toISOString()
    };

    const feedback = await readFeedback();
    feedback.unshift(newFeedback); // Add to beginning of array
    await writeFeedback(feedback);

    res.status(201).json(newFeedback);
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ error: 'Failed to create feedback' });
  }
});

// PUT /feedback/:id/vote - Upvote or downvote
app.put('/feedback/:id/vote', async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'upvote' or 'downvote'

    if (!action || !['upvote', 'downvote'].includes(action)) {
      return res.status(400).json({ error: 'Action must be "upvote" or "downvote"' });
    }

    const feedback = await readFeedback();
    const feedbackIndex = feedback.findIndex(item => item.id === id);

    if (feedbackIndex === -1) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    const voteChange = action === 'upvote' ? 1 : -1;
    feedback[feedbackIndex].votes += voteChange;

    await writeFeedback(feedback);
    res.json(feedback[feedbackIndex]);
  } catch (error) {
    console.error('Error voting on feedback:', error);
    res.status(500).json({ error: 'Failed to vote on feedback' });
  }
});

// DELETE /feedback/:id - Delete feedback
app.delete('/feedback/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await readFeedback();
    const feedbackIndex = feedback.findIndex(item => item.id === id);

    if (feedbackIndex === -1) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    const deletedFeedback = feedback.splice(feedbackIndex, 1)[0];
    await writeFeedback(feedback);

    res.json({ message: 'Feedback deleted successfully', feedback: deletedFeedback });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ error: 'Failed to delete feedback' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Feedback Tracker API running on http://localhost:${PORT}`);
  console.log(`📁 Data will be stored in: ${DATA_FILE}`);
});